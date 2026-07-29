import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ExhibitPage from './pages/ExhibitPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminExhibitEdit from './pages/AdminExhibitEdit'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/exhibit/:number" element={<ExhibitPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="exhibits/new" element={<AdminExhibitEdit />} />
          <Route path="exhibits/:id/edit" element={<AdminExhibitEdit />} />
        </Route>
        <Route path="/" element={<Navigate to="/exhibit/1" replace />} />
        <Route path="*" element={<Navigate to="/exhibit/1" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
