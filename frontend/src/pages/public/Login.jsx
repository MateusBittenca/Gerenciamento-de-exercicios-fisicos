import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import { DUR, EASE, tap } from '../../motion';
import '../../css/auth.css';

const fadeSwap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: EASE }
};

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
      <header className="uf-auth-top">
        <Link to="/" className="uf-auth-brand">
          <img src="/image/logo.png" alt="UniFit" />
        </Link>
        <Link to="/" className="uf-auth-voltar">Início</Link>
      </header>

      <div className="uf-auth-shell">
        <aside className="uf-auth-rail" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.div key={papel} {...fadeSwap}>
              <p className={'uf-auth-overline' + (ehAdmin ? ' azul' : '')}>
                {ehAdmin ? 'Painel da academia' : 'Portal do aluno'}
              </p>
              <h2>
                {ehAdmin ? <>Gestão do catálogo e das <em>fichas.</em></> : <>O treino continua <em>aqui.</em></>}
              </h2>
              <p>
                {ehAdmin
                  ? 'Alunos, exercícios e listas oficiais no mesmo lugar que o aluno vê no app.'
                  : 'Abra sua ficha, registre as séries e acompanhe a carga do último treino.'}
              </p>
              {!ehAdmin && (
                <>
                  <dl className="uf-auth-rail-dados">
                    <div>
                      <dt>Séries</dt>
                      <dd>4</dd>
                    </div>
                    <div>
                      <dt>Reps</dt>
                      <dd>8–10</dd>
                    </div>
                    <div>
                      <dt>Carga</dt>
                      <dd>40</dd>
                    </div>
                  </dl>
                  <p className="uf-auth-rail-nota">Exemplo de prescrição. Os números na conta são os seus.</p>
                </>
              )}
              {ehAdmin && (
                <ul className="uf-auth-rail-lista">
                  <li>Gestão de alunos e administradores</li>
                  <li>Catálogo de exercícios</li>
                  <li>Fichas oficiais com prescrição</li>
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>

        <div className="uf-auth-main">
          <motion.div
            className="uf-auth-box"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={papel} className="uf-auth-intro" {...fadeSwap}>
                <p className={'uf-auth-overline' + (ehAdmin ? ' azul' : '')}>
                  {ehAdmin ? 'Acesso administrativo' : 'Entrar'}
                </p>
                <h1>{ehAdmin ? 'Painel da unidade' : <>Bem-vindo de <em>volta.</em></>}</h1>
                <p className="uf-auth-lead">
                  {ehAdmin
                    ? 'Entre com o e-mail e a senha de administrador.'
                    : 'Use o e-mail e a senha da sua conta de aluno.'}
                </p>
              </motion.div>
            </AnimatePresence>

            <LayoutGroup>
            <div className="uf-auth-papeis" role="tablist" aria-label="Tipo de acesso">
              <button
                type="button"
                role="tab"
                aria-selected={!ehAdmin}
                className={!ehAdmin ? 'ativo' : ''}
                onClick={() => escolherPapel('aluno')}
              >
                Aluno
                {!ehAdmin && <motion.span layoutId="uf-auth-papel" className="uf-auth-tab-linha" />}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={ehAdmin}
                className={ehAdmin ? 'ativo admin' : 'admin'}
                onClick={() => escolherPapel('admin')}
              >
                Administrador
                {ehAdmin && <motion.span layoutId="uf-auth-papel" className="uf-auth-tab-linha admin" />}
              </button>
            </div>
            </LayoutGroup>

            <AnimatePresence>
              {erro && (
                <motion.p
                  className="uf-form-erro"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  E-mail ou senha incorretos.
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={onclick_btnLogin}>
              <div className="uf-field">
                <label htmlFor="email">E-mail</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">{ehAdmin ? 'admin_panel_settings' : 'mail'}</span>
                  <input
                    id="email"
                    type="email"
                    className="uf-input"
                    placeholder="E-mail"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="uf-field">
                <label htmlFor="senha">Senha</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                  <input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    className="uf-input"
                    placeholder="Senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="uf-eye"
                    onClick={() => setMostrarSenha((atual) => !atual)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">{mostrarSenha ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <motion.button type="submit" id="btnLogin" className={'uf-auth-enviar' + (ehAdmin ? ' admin' : '')} whileTap={tap}>
                {ehAdmin ? 'Entrar no painel' : 'Entrar'}
              </motion.button>
            </form>

            {!ehAdmin && (
              <p className="uf-auth-pe">
                Ainda não tem conta? <Link to="/cadastro">Criar conta de aluno</Link>
                <br />
                Administra uma academia? <Link to="/login?papel=admin" className="admin">Acesso administrativo</Link>
              </p>
            )}
            {ehAdmin && (
              <p className="uf-auth-pe">
                É aluno? <Link to="/login">Entrar na conta de aluno</Link>
                <br />
                <Link to="/">Voltar para o início</Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
