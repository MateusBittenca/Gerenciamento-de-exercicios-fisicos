import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const papel = searchParams.get('papel') === 'admin' ? 'admin' : 'aluno';
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    setErro(false);
    setSenha('');
  }, [papel]);

  function escolherPapel(novo) {
    if (novo === 'admin') {
      setSearchParams({ papel: 'admin' });
    } else {
      setSearchParams({});
    }
  }

  async function onclick_btnLogin(e) {
    e.preventDefault();
    const caminho = papel === 'admin' ? '/admin/login' : '/usuario/login';
    const obj = await api(caminho, {
      method: 'post',
      body: JSON.stringify({ email, senha })
    });

    if (obj.status === true) {
      login(obj.token, obj.dados);
      navigate(papel === 'admin' ? '/admin/usuarios' : '/app');
    } else {
      setErro(true);
    }
  }

  const ehAdmin = papel === 'admin';

  return (
    <div className="uf-auth">
      <div className="uf-card uf-auth-card">
        <img src="/image/logo.png" alt="UniFit" />
        <span className="uf-auth-pill"><i />{ehAdmin ? 'Portal do Administrador' : 'Portal do Aluno'}</span>
        <h1>{ehAdmin ? 'Acesso administrativo' : 'Bem-vindo de volta'}</h1>
        <p className="uf-muted">
          {ehAdmin
            ? 'Acesse o painel para gerenciar usuários, exercícios e listas.'
            : 'Entre com e-mail e senha para acessar seus treinos e listas.'}
        </p>
        <div className="uf-role-switch" role="tablist" aria-label="Tipo de acesso">
          <button type="button" role="tab" aria-selected={!ehAdmin} className={!ehAdmin ? 'ativo' : ''} onClick={() => escolherPapel('aluno')}>
            Aluno
          </button>
          <button type="button" role="tab" aria-selected={ehAdmin} className={ehAdmin ? 'ativo' : ''} onClick={() => escolherPapel('admin')}>
            Administrador
          </button>
        </div>
        {erro && <p className="uf-form-erro">E-mail ou senha incorretos.</p>}
        <form onSubmit={onclick_btnLogin}>
          <div className="uf-field">
            <label htmlFor="email">E-mail</label>
            <div className="uf-input-icon">
              <span className="material-symbols-outlined">{ehAdmin ? 'admin_panel_settings' : 'mail'}</span>
              <input id="email" type="email" className="uf-input" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="uf-field">
            <label htmlFor="senha">Senha</label>
            <div className="uf-input-icon">
              <span className="material-symbols-outlined">lock</span>
              <input id="senha" type={mostrarSenha ? 'text' : 'password'} className="uf-input" placeholder="••••••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <button type="button" className="uf-eye" onClick={() => setMostrarSenha((atual) => !atual)} aria-label="Alternar senha">
                <span className="material-symbols-outlined">{mostrarSenha ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          <button type="submit" id="btnLogin" className="uf-btn-primary">
            {ehAdmin ? 'Entrar no painel' : 'Entrar na minha conta'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
        {!ehAdmin && (
          <>
            <div className="uf-auth-divider">Novo por aqui?</div>
            <Link to="/cadastro" className="uf-btn-ghost" style={{ width: '100%', color: '#C30505' }}>
              <span className="material-symbols-outlined">person_add</span>
              Criar meu cadastro de aluno
            </Link>
            <p className="uf-muted" style={{ marginTop: 16 }}>
              <Link to="/login?papel=admin" style={{ color: 'var(--uf-secondary)', fontWeight: 600 }}>
                É um gestor? Acesse o portal do administrador
              </Link>
            </p>
          </>
        )}
        {ehAdmin && (
          <p className="uf-muted" style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: '#C30505', fontWeight: 600 }}>Voltar para o início</Link>
          </p>
        )}
      </div>
    </div>
  );
}
