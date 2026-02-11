import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';
import logo from '../assets/images/logo.png';
import '../styles/login.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await authService.cadastrar(nome, email, senha);
    setIsLoading(false);
    if (result.success) {
      await Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Sucesso!',
        text: 'Cadastro realizado com sucesso!',
        icon: 'success',
        confirmButtonColor: '#dc2626'
      });
      navigate('/login');
    } else {
      Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Erro!',
        text: result.message || 'Erro ao realizar cadastro!',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const getPasswordStrength = () => {
    if (!senha) return { strength: 0, label: '', color: '' };
    const length = senha.length;
    const hasNumbers = /\d/.test(senha);
    const hasLetters = /[a-zA-Z]/.test(senha);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    let strength = 0;
    if (length >= 6) strength++;
    if (length >= 8) strength++;
    if (hasNumbers && hasLetters) strength++;
    if (hasSpecial) strength++;
    
    const levels = [
      { strength: 1, label: 'Fraca', color: '#ef4444' },
      { strength: 2, label: 'Média', color: '#f59e0b' },
      { strength: 3, label: 'Boa', color: '#10b981' },
      { strength: 4, label: 'Forte', color: '#10b981' }
    ];
    
    return levels[strength - 1] || levels[0];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="Unifit" />
          <span>Unifit</span>
        </Link>
        <nav className="auth-nav">
          <Link to="/">Início</Link>
          <Link to="/login" className="auth-nav-highlight">Entrar</Link>
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
              <h2 className="auth-sidebar-title">Comece sua jornada</h2>
              <p className="auth-sidebar-text">
                Crie sua conta gratuita e tenha acesso a todas as ferramentas para organizar seus treinos.
              </p>
              <div className="auth-sidebar-features">
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>100% gratuito, para sempre</span>
                </div>
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Catálogo completo de exercícios</span>
                </div>
                <div className="auth-sidebar-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Criação ilimitada de treinos</span>
                </div>
              </div>
              <div className="auth-sidebar-badge">
                <i className="bi bi-shield-check"></i>
                <span>Seus dados estão seguros</span>
              </div>
            </div>
            <div className="auth-sidebar-decoration"></div>
          </div>

          <div className="auth-form-container">
            <div className="auth-card">
              <div className="auth-card-head">
                <h1>Criar sua conta</h1>
                <p className="auth-card-sub">Preencha os dados abaixo para começar</p>
              </div>
              <form onSubmit={handleCadastro} className="auth-form">
                <div className="form-group">
                  <label htmlFor="txtnome">Nome completo</label>
                  <div className="input-wrap">
                    <i className="bi bi-person" aria-hidden />
                    <input
                      type="text"
                      id="txtnome"
                      placeholder="Digite seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
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
                      placeholder="Mínimo 6 caracteres"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      autoComplete="new-password"
                      minLength={6}
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
                  {senha && (
                    <div className="password-strength">
                      <div className="password-strength-bar">
                        <div 
                          className="password-strength-fill" 
                          style={{ 
                            width: `${(passwordStrength.strength / 4) * 100}%`,
                            backgroundColor: passwordStrength.color 
                          }}
                        ></div>
                      </div>
                      <span className="password-strength-label" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>
                <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>Criar conta</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>
              <div className="auth-divider">
                <span>ou</span>
              </div>
              <p className="auth-footer-link">
                Já tem uma conta? <Link to="/login">Entre agora</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;
