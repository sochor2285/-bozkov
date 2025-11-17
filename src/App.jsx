import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'
import Navbar from './components/Navbar/Navbar'
import Homepage from './pages/Homepage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import OrderHistory from './components/Orders/OrderHistory'
import AdminPanel from './components/Admin/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const { initialize, user } = useAuthStore()
  const fetchCart = useCartStore(state => state.fetchCart)

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (user) {
      fetchCart(user.id)
    }
  }, [user, fetchCart])

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid rgba(218, 165, 32, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#daa520',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
