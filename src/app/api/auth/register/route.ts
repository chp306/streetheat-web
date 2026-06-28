import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  referralCode: z.string().optional(),
});

function generateReferralCode(firstName: string): string {
  const prefix = firstName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "");
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, referralCode } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let referredByUserId: string | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referredByUserId = referrer.id;
      }
    }

    const bronzeTier = await prisma.loyaltyTier.findUnique({
      where: { name: "Bronze" },
    });
    if (!bronzeTier) {
      return NextResponse.json(
        { error: "Loyalty system not initialised. Please contact support." },
        { status: 500 }
      );
    }

    const passwordHash = await hashPassword(password);
    let newReferralCode = generateReferralCode(firstName);
    while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } })) {
      newReferralCode = generateReferralCode(firstName);
    }

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          referralCode: newReferralCode,
          referredByUserId,
        },
      });

      await tx.loyaltyAccount.create({
        data: {
          userId: created.id,
          currentTierId: bronzeTier.id,
        },
      });

      return created;
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          referralCode: user.referralCode,
        },
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
