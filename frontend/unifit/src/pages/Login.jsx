import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import logo from '../assets/images/logo.png';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, senha);
    setIsLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message);
      setShowModal(true);
      setEmail('');
      setSenha('');
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="Unifit" />
          <span>Unifit</span>
        </Link>
        <nav className="auth-nav">
          <Link to="/">Início</Link>
          <Link to="/cadastro" className="auth-nav-highlight">Cadastrar</Link>
          <Link to="/login-admin" className="auth-nav-admin">Admin</Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-sidebar">
            <div className="auth-sidebar-content">
              <div className="auth-sidebar-icon">
                <img src={logo} alt="Unifit" />
              </div>
              <h2 className="auth-sidebar-title">Bem-vindo de volta!</h2>
              <p className="auth-sidebar-text">
                Acesse sua conta e continue organizando seus treinos de forma profissional.
              </p>
              <div className="auth-sidebar-features">
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Treinos personalizados</span>
                </div>
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Acompanhamento de progresso</span>
                </div>
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Acesso em qualquer dispositivo</span>
                </div>
              </div>
            </div>
            <div className="auth-sidebar-decoration"></div>
          </div>

          <div className="auth-form-container">
            <div className="auth-card">
              <div className="auth-card-head">
                <h1>Entrar na sua conta</h1>
                <p className="auth-card-sub">Use suas credenciais para acessar</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="txtemail">Email</label>
                  <div className="input-wrap">
                    <i className="bi bi-envelope" aria-hidden />
                    <input
                      type="email"
                      id="txtemail"
                      placeholder="seu@email.com"
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
                <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>
              <div className="auth-divider">
                <span>ou</span>
              </div>
              <p className="auth-footer-link">
                Não tem uma conta? <Link to="/cadastro">Crie uma grátis</Link>
              </p>
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

export default Login;
