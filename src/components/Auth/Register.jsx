import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore(state => state.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Hesla se neshodují')
      return
    }

    if (password.length < 6) {
      toast.error('Heslo musí mít alespoň 6 znaků')
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      toast.success('Registrace úspěšná! Zkontrolujte email pro potvrzení.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Chyba při registraci')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registrace</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vas@email.cz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Heslo</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Potvrdit heslo</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registruji...' : 'Zaregistrovat se'}
          </button>
        </form>
        <p className="auth-footer">
          Již máte účet? <Link to="/login">Přihlaste se</Link>
        </p>
      </div>
    </div>
  )
}
