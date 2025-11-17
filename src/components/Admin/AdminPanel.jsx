import { useEffect, useState } from 'react'
import { useProductStore } from '../../stores/productStore'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Admin.css'

export default function AdminPanel() {
  const navigate = useNavigate()
  const profile = useAuthStore(state => state.profile)
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    alcohol: '',
    price: '',
    stock: ''
  })

  useEffect(() => {
    if (!profile?.is_admin) {
      toast.error('Nemáte oprávnění k admin panelu')
      navigate('/')
      return
    }
    fetchProducts()
    fetchAllOrders()
  }, [profile, navigate])

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          status,
          created_at,
          user_id,
          order_items (
            quantity,
            price,
            product:products (name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Chyba při načítání objednávek:', error)
      toast.error('Nepodařilo se načíst objednávky')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
        setEditingProduct(null)
      } else {
        await createProduct({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      }
      resetForm()
    } catch (error) {
      console.error('Chyba při ukládání produktu:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      type: product.type,
      alcohol: product.alcohol,
      price: product.price.toString(),
      stock: product.stock.toString()
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Opravdu chcete smazat tento produkt?')) {
      await deleteProduct(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      alcohol: '',
      price: '',
      stock: ''
    })
    setEditingProduct(null)
  }

  if (!profile?.is_admin) {
    return null
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Produkty
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Objednávky
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-content">
          <div className="admin-form-section">
            <h2>{editingProduct ? 'Upravit produkt' : 'Přidat produkt'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Název</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Typ</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Popis</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Alkohol</label>
                  <input
                    type="text"
                    value={formData.alcohol}
                    onChange={(e) => setFormData({...formData, alcohol: e.target.value})}
                    placeholder="např. 38%"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cena (Kč)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Skladem (ks)</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Aktualizovat' : 'Přidat produkt'}
                </button>
                {editingProduct && (
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Zrušit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-products-list">
            <h2>Produkty</h2>
            {loading ? (
              <p>Načítám...</p>
            ) : (
              <div className="products-table">
                {products.map(product => (
                  <div key={product.id} className="product-row">
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.type} • {product.alcohol} • {product.price} Kč • Skladem: {product.stock}</p>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleEdit(product)} className="btn-edit">
                        Upravit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">
                        Smazat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-content">
          <h2>Všechny objednávky</h2>
          <div className="orders-table">
            {orders.map(order => (
              <div key={order.id} className="order-row">
                <div className="order-info">
                  <h3>Objednávka #{order.id.substring(0, 8)}</h3>
                  <p>
                    {new Date(order.created_at).toLocaleDateString('cs-CZ')} •
                    {order.order_items.length} položek •
                    {order.total_price} Kč
                  </p>
                  <div className="order-items-preview">
                    {order.order_items.map((item, i) => (
                      <span key={i}>{item.quantity}x {item.product.name}</span>
                    ))}
                  </div>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status === 'completed' ? 'Dokončeno' : 'Čeká'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
