import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedback } from '../../auth/FeedbackContext';
import { api } from '../../api/client';
import '../../css/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useFeedback();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [termos, setTermos] = useState(false);
  const [erro, setErro] = useState('');

  async function onclick_btnCadastrar(e) {
    e.preventDefault();
    setErro('');
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (!termos) {
      setErro('Confirme que os dados informados são seus.');
      return;
    }
    const obj = await api('/usuario/cadastrar', {
      method: 'post',
      body: JSON.stringify({ nome, email, senha, sexo, altura, peso })
    });

    if (obj.status === true) {
      toast('ok', 'Conta criada. Entre com e-mail e senha.');
      navigate('/login');
    } else {
      setErro(obj.msg || 'Não foi possível cadastrar este e-mail.');
    }
  }

  return (
    <div className="uf-auth cadastro">
      <header className="uf-auth-top">
        <Link to="/" className="uf-auth-brand">
          <img src="/image/logo.png" alt="UniFit" />
        </Link>
        <Link to="/login" className="uf-auth-voltar">Entrar</Link>
      </header>

      <div className="uf-auth-shell">
        <aside className="uf-auth-rail">
          <p className="uf-auth-overline">Cadastro de aluno</p>
          <h2>Primeiro a conta. Depois a <em>ficha.</em></h2>
          <p>
            O cadastro cria só o perfil de aluno. Em seguida você entra com e-mail e senha —
            a conta não abre sozinha.
          </p>
          <dl className="uf-auth-rail-dados">
            <div>
              <dt>Altura</dt>
              <dd>m</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>kg</dd>
            </div>
            <div>
              <dt>Perfil</dt>
              <dd>IMC</dd>
            </div>
          </dl>
          <p className="uf-auth-rail-nota">
            Altura e peso entram no perfil para o cálculo de IMC. Não vão para um instrutor automático.
          </p>
        </aside>

        <div className="uf-auth-main">
          <div className="uf-auth-box">
            <p className="uf-auth-overline">Nova conta</p>
            <h1>Criar conta de <em>aluno.</em></h1>
            <p className="uf-auth-lead">Nome, e-mail, senha e os dados que o perfil usa no IMC.</p>

            <form onSubmit={onclick_btnCadastrar}>
              {erro && <p className="uf-form-erro" role="alert">{erro}</p>}

              <p className="uf-auth-etapa"><span>01</span> Acesso</p>

              <div className="uf-field">
                <label htmlFor="nome">Nome completo</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                  <input
                    id="nome"
                    type="text"
                    className="uf-input"
                    placeholder="Nome completo"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="uf-field">
                <label htmlFor="email">E-mail</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">mail</span>
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
              <div className="uf-auth-dupla">
                <div className="uf-field">
                  <label htmlFor="senha">Senha</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                    <input
                      id="senha"
                      type="password"
                      className="uf-input"
                      placeholder="Senha"
                      autoComplete="new-password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="uf-field">
                  <label htmlFor="confirmar">Confirmar senha</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined" aria-hidden="true">lock_reset</span>
                    <input
                      id="confirmar"
                      type="password"
                      className="uf-input"
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <p className="uf-auth-etapa"><span>02</span> Perfil</p>

              <fieldset className="uf-field">
                <legend>Sexo</legend>
                <div className="uf-gender">
                  <button type="button" className={sexo === 'Feminino' ? 'ativo' : ''} onClick={() => setSexo('Feminino')}>
                    Feminino
                  </button>
                  <button type="button" className={sexo === 'Masculino' ? 'ativo' : ''} onClick={() => setSexo('Masculino')}>
                    Masculino
                  </button>
                  <button type="button" className={sexo === 'Outro' ? 'ativo' : ''} onClick={() => setSexo('Outro')}>
                    Outro
                  </button>
                </div>
                <input
                  className="uf-auth-required-ghost"
                  type="text"
                  value={sexo}
                  required
                  readOnly
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </fieldset>

              <div className="uf-auth-dupla">
                <div className="uf-field">
                  <label htmlFor="altura">Altura (m)</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined" aria-hidden="true">height</span>
                    <input
                      id="altura"
                      type="text"
                      inputMode="decimal"
                      className="uf-input"
                      placeholder="1.68"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="uf-field">
                  <label htmlFor="peso">Peso (kg)</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined" aria-hidden="true">fitness_center</span>
                    <input
                      id="peso"
                      type="text"
                      inputMode="decimal"
                      className="uf-input"
                      placeholder="62.5"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="uf-auth-check">
                <input type="checkbox" checked={termos} onChange={(e) => setTermos(e.target.checked)} />
                Confirmo que os dados informados são meus.
              </label>

              <button id="btncadastrar" className="uf-auth-enviar" type="submit">
                Criar conta
              </button>
            </form>

            <p className="uf-auth-pe">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
