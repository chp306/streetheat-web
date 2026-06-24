'use client'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.id,
            variantId: i.productVariantId,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout failed. Please try again.')
    } catch (err) {
      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-4">
      <p className="text-xl">Your cart is empty</p>
      <button onClick={() => router.push('/products')} className="bg-[#F5A623] text-black px-6 py-3 font-bold">
        SHOP NOW
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col gap-4 mb-8">
        {items.map(item => (
          <div key={item.productVariantId} className="flex justify-between items-center border border-white/10 p-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-400">{item.brand} · Size {item.size} × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[#F5A623] font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.productVariantId)} className="text-red-400 text-sm hover:text-red-300">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-8">
        <span className="text-lg">Total</span>
        <span className="text-2xl font-bold text-[#F5A623]">£{total.toFixed(2)}</span>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[#F5A623] text-black font-bold py-4 text-lg disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
      </button>
    </div>
  )
}
