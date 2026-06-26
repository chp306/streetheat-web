import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { items } = await req.json()
    // items: [{ productId, variantId, quantity }]

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    // Fetch variants and calculate total
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: items.map((i: any) => i.variantId) } },
      include: { product: true },
    })

    const lineItems = variants.map((v) => {
      const item = items.find((i: any) => i.variantId === v.id)
      return {
        price_data: {
          currency: 'gbp',
          product_data: { name: `${v.product.name} - Size ${v.size}` },
          unit_amount: Math.round(Number(v.product.basePrice) * 100),
        },
        quantity: item?.quantity || 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        userId: payload.userId,
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
