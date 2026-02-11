import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import logo from '../assets/images/logo.png';
import '../styles/login.css';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await loginAdmin(email, senha);
    setIsLoading(false);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(result.message);
      setShowModal(true);
      setEmail('');
      setSenha('');
    }
  };

  return (
    <div className="auth-page auth-page-admin">
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="Unifit" />
          <span>Unifit</span>
        </Link>
        <nav className="auth-nav">
          <Link to="/">Início</Link>
          <Link to="/login" className="auth-nav-highlight">Usuários</Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-container auth-container-simple">
          <div className="auth-form-container auth-form-admin">
            <div className="auth-card">
              <div className="auth-card-head">
                <div className="admin-badge">
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Área Administrativa</span>
                </div>
                <h1>Acesso Administrativo</h1>
                <p className="auth-card-sub">Esta área é restrita a administradores do sistema</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="txtemail">Email do Administrador</label>
                  <div className="input-wrap">
                    <i className="bi bi-envelope" aria-hidden />
                    <input
                      type="email"
                      id="txtemail"
                      placeholder="admin@unifit.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="txtsenha">Senha</label>
                  <div className="input-wrap">
                    <i className="bi bi-lock" aria-hidden />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="txtsenha"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="input-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    >
                      <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                    </button>
                  </div>
                </div>
                <button type="submit" className="auth-btn-submit auth-btn-admin" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i>
                      <span>Entrar como Admin</span>
                    </>
                  )}
                </button>
              </form>
              <div className="admin-notice">
                <i className="bi bi-info-circle"></i>
                <span>Acesso somente para membros autorizados da equipe</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{errorMessage}</h2>
      </Modal>
    </div>
  );
};

export default LoginAdmin;
