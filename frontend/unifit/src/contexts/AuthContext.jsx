import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = authService.verificarSessao();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const result = await authService.login(email, senha);
    if (result.success) {
      setUser(result.data.dados);
    }
    return result;
  };

  const loginAdmin = async (email, senha) => {
    const result = await authService.loginAdmin(email, senha);
    if (result.success) {
      setUser(result.data.dados);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
    const payload = localStorage.getItem('payload');
    if (payload) {
      try {
        const parsed = JSON.parse(payload);
        localStorage.setItem('payload', JSON.stringify({ ...parsed, ...newData }));
      } catch (_) {}
    }
  };

  const value = {
    user,
    login,
    loginAdmin,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
