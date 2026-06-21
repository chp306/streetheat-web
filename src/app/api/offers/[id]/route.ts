import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const payload = verifyToken(token);
    if (payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { action, counterPrice } = await req.json();

    if (!["accept", "counter", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({ where: { id: params.id } });
    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    if (offer.status !== "pending") return NextResponse.json({ error: "Offer already resolved" }, { status: 400 });

    const updated = await prisma.offer.update({
      where: { id: params.id },
      data: {
        status: action === "accept" ? "accepted" : action === "counter" ? "countered" : "rejected",
        counterPrice: action === "counter" ? Number(counterPrice) : undefined,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
