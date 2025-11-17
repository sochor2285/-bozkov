import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import CartButton from '../Cart/CartButton'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
  const { user, profile, logout } = useAuthStore()
  const fetchCart = useCartStore(state => state.fetchCart)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Odhlášeno')
    } catch (error) {
      toast.error('Chyba při odhlašování')
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">BOŽKOV</Link>
        <ul className="nav-menu">
          <li><Link to="/">Domů</Link></li>
          <li><a href="/#products">Produkty</a></li>
          <li><a href="/#history">Historie</a></li>
          {user && <li><Link to="/orders">Objednávky</Link></li>}
          {profile?.is_admin && <li><Link to="/admin">Admin</Link></li>}
        </ul>
        <div className="nav-actions">
          {user ? (
            <>
              <CartButton />
              <button onClick={handleLogout} className="btn-logout">
                Odhlásit
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Přihlásit</Link>
              <Link to="/register" className="btn-register">Registrace</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
