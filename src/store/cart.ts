import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  productVariantId: string
  name: string
  brand: string
  size: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productVariantId: string) => void
  clearCart: () => void
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.productVariantId === item.productVariantId)
        if (existing) {
          set({ items: get().items.map(i =>
            i.productVariantId === item.productVariantId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )})
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (productVariantId) => {
        set({ items: get().items.filter(i => i.productVariantId !== productVariantId) })
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'streetheat-cart' }
  )
)

// Alias for cart page
export const useCart = useCartStore
