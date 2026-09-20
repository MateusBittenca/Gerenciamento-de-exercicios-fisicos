import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import '../../css/login.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  async function onclick_btnLogin(e) {
    e.preventDefault();
    const obj = await api('/admin/login', {
      method: 'post',
      body: JSON.stringify({ email, senha })
    });

    if (obj.status === true) {
      login(obj.token, obj.dados);
      navigate('/admin/usuarios');
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
            <span className="title">Login como admin</span>
            <span className="subtitle">Entre na sua conta ser um admin!</span>
            <div className="form-container">
              <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <button id="btnLogin">Entrar</button>
          </form>
          <div className="form-section">
            <p>Não possui uma conta de Admin? <Link to="/">Volte para o inicio!</Link></p>
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
