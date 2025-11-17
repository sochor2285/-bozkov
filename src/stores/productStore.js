import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ products: data || [], loading: false })
    } catch (error) {
      console.error('Chyba při načítání produktů:', error)
      toast.error('Nepodařilo se načíst produkty')
      set({ loading: false })
    }
  },

  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) throw error
      set((state) => ({ products: [...state.products, data] }))
      toast.success('Produkt vytvořen')
      return data
    } catch (error) {
      console.error('Chyba při vytváření produktu:', error)
      toast.error('Nepodařilo se vytvořit produkt')
      throw error
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set((state) => ({
        products: state.products.map(p => p.id === id ? data : p)
      }))
      toast.success('Produkt aktualizován')
      return data
    } catch (error) {
      console.error('Chyba při aktualizaci produktu:', error)
      toast.error('Nepodařilo se aktualizovat produkt')
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }))
      toast.success('Produkt smazán')
    } catch (error) {
      console.error('Chyba při mazání produktu:', error)
      toast.error('Nepodařilo se smazat produkt')
      throw error
    }
  },
}))
