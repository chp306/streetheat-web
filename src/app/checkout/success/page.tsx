'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const { clearCart } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl">✓</div>
      <h1 className="text-3xl font-bold text-[#F5A623]">Order Confirmed!</h1>
      <p className="text-gray-400 text-center max-w-md">
        Thanks for your purchase. We will be in touch shortly with shipping details.
      </p>
      <button
        onClick={() => router.push('/products')}
        className="bg-[#F5A623] text-black font-bold px-8 py-3 mt-4"
      >
        CONTINUE SHOPPING
      </button>
    </div>
  )
}
