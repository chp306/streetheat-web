import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-bootstrap-secret");
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!expected) {
      return NextResponse.json({ error: "Bootstrap disabled" }, { status: 503 });
    }
    if (!secret || secret !== expected) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists", adminEmail: existingAdmin.email },
        { status: 409 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const promoted = await prisma.user.update({
      where: { id: user.id },
      data: { role: "admin" },
      select: { id: true, email: true, role: true, firstName: true },
    });

    return NextResponse.json({ ok: true, user: promoted });
  } catch (err: any) {
    console.error("BOOTSTRAP ERROR:", err);
    return NextResponse.json(
      { error: "Internal error", detail: err.message },
      { status: 500 }
    );
  }
}
