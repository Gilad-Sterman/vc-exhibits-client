import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../redux/slices/authSlice'

function AdminLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, loading, error } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (token) navigate('/admin', { replace: true })
  }, [token, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginAdmin({ email, password }))
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <h1>Admin Login</h1>
        <Link to="/exhibit/1" className="login-exhibits-link">← To Exhibits</Link>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
