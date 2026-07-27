import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ExhibitPage from './pages/ExhibitPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminExhibitEdit from './pages/AdminExhibitEdit'
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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exhibits/new"
          element={
            <ProtectedRoute>
              <AdminExhibitEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exhibits/:id/edit"
          element={
            <ProtectedRoute>
              <AdminExhibitEdit />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
