import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Sign in to make an offer" }, { status: 401 });

    const payload = verifyToken(token);
    const { productVariantId, offerPrice } = await req.json();

    if (!productVariantId || !offerPrice) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: { product: true },
    });
    if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    if (!variant.product.offerEnabled) return NextResponse.json({ error: "Offers not enabled" }, { status: 400 });

    const listedPrice = Number(variant.product.basePrice);
    const floor = listedPrice * 0.75;

    if (Number(offerPrice) < floor) {
      return NextResponse.json({
        error: `Minimum offer is £${floor.toFixed(2)}`,
        floor: floor.toFixed(2),
      }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        productVariantId,
        userId: payload.userId,
        offerPrice: Number(offerPrice),
        listedPrice,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const payload = verifyToken(token);
    if (payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const offers = await prisma.offer.findMany({
      include: {
        productVariant: { include: { product: { include: { brand: true } } } },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ offers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
