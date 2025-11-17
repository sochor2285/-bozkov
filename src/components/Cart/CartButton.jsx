import { useState } from 'react'
import { useCartStore } from '../../stores/cartStore'
import CartModal from './CartModal'
import './Cart.css'

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = useCartStore(state => state.getItemCount())

  return (
    <>
      <button className="cart-button" onClick={() => setIsOpen(true)}>
        <span className="cart-icon">🛒</span>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>
      <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
