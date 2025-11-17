import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { useNavigate } from 'react-router-dom'
import './Products.css'

export default function ProductCard({ product }) {
  const user = useAuthStore(state => state.user)
  const addItem = useCartStore(state => state.addItem)
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addItem(user.id, product, 1)
  }

  return (
    <div className="product-card">
      <div className="product-icon">🥃</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-type">{product.type}</p>
      <p className="product-description">{product.description}</p>
      <div className="product-details">
        <div className="product-alcohol">{product.alcohol}</div>
        <div className="product-price">{product.price} Kč</div>
      </div>
      {product.stock > 0 ? (
        <>
          <p className="product-stock">Skladem: {product.stock} ks</p>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Přidat do košíku
          </button>
        </>
      ) : (
        <p className="product-out-of-stock">Není skladem</p>
      )}
    </div>
  )
}
