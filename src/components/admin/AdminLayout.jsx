import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <span className="admin-logo">CenterInfo Admin</span>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
