import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import '../styles/login.css';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await loginAdmin(email, senha);
    
    if (result.success) {
      navigate('/admin/home');
    } else {
      setErrorMessage(result.message);
      setShowModal(true);
      setEmail('');
      setSenha('');
    }
  };

  return (
    <div className="banner">
      <div className="navbar">
        <p></p>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/login">Usuários</Link></li>
        </ul>
      </div>
      <div className="content">
        <h1>Login Administrador</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="txtemail">Email:</label>
            <input
              type="email"
              id="txtemail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="txtsenha">Senha:</label>
            <input
              type="password"
              id="txtsenha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" id="btnLogin">
            <span></span>Entrar
          </button>
        </form>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{errorMessage}</h2>
      </Modal>
    </div>
  );
};

export default LoginAdmin;
