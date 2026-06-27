import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        loyaltyAccount: {
          include: { currentTier: true },
        },
      },
    });

    const genericError = NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );

    if (!user) return genericError;

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) return genericError;

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
          loyaltyTier: user.loyaltyAccount?.currentTier.name ?? null,
          loyaltyPoints: user.loyaltyAccount?.pointsBalance ?? 0,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
