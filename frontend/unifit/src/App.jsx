import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas
import Landing from './pages/Landing';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import Cadastro from './pages/Cadastro';

// Páginas privadas
import Home from './pages/Home';
import Exercicios from './pages/Exercicios';
import Listas from './pages/Listas';
import MinhasListas from './pages/MinhasListas';
import Usuario from './pages/Usuario';
import Configuracoes from './pages/Configuracoes';

// Páginas de admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminExercicios from './pages/admin/AdminExercicios';
import AdminListas from './pages/admin/AdminListas';
import AdminAdmins from './pages/admin/AdminAdmins';
import AdminLogs from './pages/admin/AdminLogs';
import AdminRelatorios from './pages/admin/AdminRelatorios';

// Estilos globais
import './App.css';
import './styles/menu-lateral.css';
import './styles/table.css';
import './styles/admin.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercicios"
            element={
              <ProtectedRoute>
                <Exercicios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listas"
            element={
              <ProtectedRoute>
                <Listas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minhas-listas"
            element={
              <ProtectedRoute>
                <MinhasListas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuario"
            element={
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracoes"
            element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            }
          />

          {/* Rotas administrativas (protegidas com adminOnly) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exercicios"
            element={
              <ProtectedRoute adminOnly>
                <AdminExercicios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listas"
            element={
              <ProtectedRoute adminOnly>
                <AdminListas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <ProtectedRoute adminOnly>
                <AdminAdmins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute adminOnly>
                <AdminLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/relatorios"
            element={
              <ProtectedRoute adminOnly>
                <AdminRelatorios />
              </ProtectedRoute>
            }
          />

          {/* Rota padrão - redireciona para home ou landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
