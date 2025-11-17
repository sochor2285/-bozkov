import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './Orders.css'

export default function OrderHistory() {
  const user = useAuthStore(state => state.user)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          status,
          created_at,
          order_items (
            quantity,
            price,
            product:products (name, type, alcohol)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Chyba při načítání objednávek:', error)
      toast.error('Nepodařilo se načíst objednávky')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">Načítám objednávky...</div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Moje objednávky</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>Zatím nemáte žádné objednávky</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Objednávka #{order.id.substring(0, 8)}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge status-${order.status}`}>
                    {order.status === 'completed' ? 'Dokončeno' : 'Čeká'}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.order_items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-info">
                      <p className="item-name">{item.product.name}</p>
                      <p className="item-details">
                        {item.product.type} • {item.product.alcohol}
                      </p>
                    </div>
                    <div className="order-item-quantity">
                      <span>{item.quantity}x</span>
                      <span className="item-price">{item.price} Kč</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Celkem:</span>
                <span className="total-amount">{order.total_price} Kč</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
