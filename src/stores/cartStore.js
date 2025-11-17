import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async (userId) => {
    if (!userId) {
      set({ items: [] })
      return
    }

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:products(*)
        `)
        .eq('user_id', userId)

      if (error) throw error
      set({ items: data || [], loading: false })
    } catch (error) {
      console.error('Chyba při načítání košíku:', error)
      toast.error('Nepodařilo se načíst košík')
      set({ loading: false })
    }
  },

  addItem: async (userId, product, quantity = 1) => {
    if (!userId) {
      toast.error('Pro přidání do košíku se musíte přihlásit')
      return
    }

    try {
      const { items } = get()
      const existingItem = items.find(item => item.product.id === product.id)

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: product.id,
            quantity,
          })

        if (error) throw error
      }

      await get().fetchCart(userId)
      toast.success(`${product.name} přidán do košíku`)
    } catch (error) {
      console.error('Chyba při přidávání do košíku:', error)
      toast.error('Nepodařilo se přidat produkt do košíku')
    }
  },

  updateQuantity: async (userId, cartItemId, quantity) => {
    if (quantity < 1) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

      if (error) throw error
      await get().fetchCart(userId)
    } catch (error) {
      console.error('Chyba při aktualizaci množství:', error)
      toast.error('Nepodařilo se aktualizovat množství')
    }
  },

  removeItem: async (userId, cartItemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error
      await get().fetchCart(userId)
      toast.success('Položka odstraněna z košíku')
    } catch (error) {
      console.error('Chyba při odstraňování z košíku:', error)
      toast.error('Nepodařilo se odstranit položku')
    }
  },

  clearCart: async (userId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
      set({ items: [] })
    } catch (error) {
      console.error('Chyba při mazání košíku:', error)
      toast.error('Nepodařilo se vymazat košík')
    }
  },

  getTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },
}))
