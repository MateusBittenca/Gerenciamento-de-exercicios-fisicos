import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import '../../css/login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  async function onclick_btnLogin(e) {
    e.preventDefault();
    const obj = await api('/usuario/login', {
      method: 'post',
      body: JSON.stringify({ email, senha })
    });

    if (obj.status === true) {
      login(obj.token, obj.dados);
      navigate('/app');
    } else {
      setErro(true);
      setEmail('');
      setSenha('');
    }
  }

  return (
    <div className="banner pagina-login">
      <div className="container">
        <div className="form-box">
          <form className="form" onSubmit={onclick_btnLogin}>
            <span className="title">Login</span>
            <span className="subtitle">Entre na sua conta para poder usar os nossos recursos.</span>
            <div className="form-container">
              <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <button type="submit" id="btnLogin">Entrar</button>
          </form>
          <div className="form-section">
            <p>Ainda não possui uma conta? <Link to="/cadastro">Clique aqui!</Link></p>
          </div>
        </div>
      </div>
      {erro && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setErro(false)}>&times;</span>
            <h2>Email ou senha incorretas!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
