import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';

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
    <div className="uf-auth">
      <div className="uf-card uf-auth-card">
        <img src="/image/logo.png" alt="UniFit" />
        <span className="uf-chip uf-chip-ativo" style={{ margin: '16px auto 8px', cursor: 'default' }}>Portal Admin</span>
        <h1>Entrar como admin</h1>
        <p className="uf-muted">Acesse o painel para gerenciar usuários, exercícios e listas.</p>
        <form onSubmit={onclick_btnLogin}>
          <div className="uf-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="uf-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" className="uf-input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <button id="btnLogin" className="uf-btn-primary" type="submit">Entrar</button>
        </form>
        <p className="uf-muted" style={{ marginTop: 16 }}>
          Não possui uma conta de Admin? <Link to="/" style={{ color: '#C30505', fontWeight: 600 }}>Volte para o início!</Link>
        </p>
      </div>
      {erro && (
        <div className="uf-modal" onClick={() => setErro(false)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setErro(false)}>&times;</button>
            <h2>Email ou senha incorretas!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
