import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading" aria-live="polite" aria-busy="true">
        <div className="spinner" aria-hidden />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota requer admin e o usuário não é admin
  if (adminOnly && !user?.AdministradorID) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
