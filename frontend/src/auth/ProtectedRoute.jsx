import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ role }) {
  const { token, payload, role: currentRole } = useAuth();

  if (!token || !payload) { 
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (currentRole !== role) {
    if (currentRole === 'admin') {
      return <Navigate to="/admin/usuarios" replace />;
    }
    if (currentRole === 'user') {
      return <Navigate to="/app" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
