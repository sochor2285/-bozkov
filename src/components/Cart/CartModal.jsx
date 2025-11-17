import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './Cart.css'

export default function CartModal({ isOpen, onClose }) {
  const user = useAuthStore(state => state.user)
  const { items, loading, fetchCart, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && user) {
      fetchCart(user.id)
    }
  }, [isOpen, user, fetchCart])

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Pro dokončení objednávky se přihlaste')
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast.error('Košík je prázdný')
      return
    }

    try {
      const totalPrice = getTotal()

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          status: 'completed'
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      await clearCart(user.id)
      toast.success('Objednávka úspěšně vytvořena!')
      onClose()
      navigate('/orders')
    } catch (error) {
      console.error('Chyba při vytváření objednávky:', error)
      toast.error('Nepodařilo se vytvořit objednávku')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nákupní košík</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="cart-loading">Načítám...</div>
          ) : items.length === 0 ? (
            <div className="cart-empty">
              <p>Váš košík je prázdný</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h3>{item.product.name}</h3>
                      <p className="cart-item-price">{item.product.price} Kč</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(user.id, item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(user.id, item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(user.id, item.id)}
                      >
                        Odstranit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <h3>Celkem</h3>
                <p className="total-price">{getTotal().toFixed(2)} Kč</p>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="modal-footer">
            <button className="checkout-button" onClick={handleCheckout}>
              Dokončit objednávku
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
