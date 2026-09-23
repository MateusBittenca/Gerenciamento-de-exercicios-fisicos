import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedback } from '../../auth/FeedbackContext';
import { api } from '../../api/client';

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
      setErro('Aceite os termos para continuar.');
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
    <div className="uf-auth">
      <div className="uf-card uf-auth-card wide">
        <div className="uf-auth-split">
          <div className="uf-auth-form-col">
            <div style={{ marginBottom: 24 }}>
              <img src="/image/logo.png" alt="UniFit" />
              <span className="uf-auth-pill"><i />Cadastro de aluno</span>
            </div>
            <h1 style={{ fontSize: 28, lineHeight: '36px' }}>Crie sua conta no UniFit</h1>
            <p className="uf-muted">Preencha seus dados para conectar seu perfil às listas oficiais da sua academia.</p>
            <form onSubmit={onclick_btnCadastrar}>
              {erro && <p className="uf-form-erro">{erro}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="uf-chip" style={{ cursor: 'default', width: 24, height: 24, padding: 0, justifyContent: 'center' }}>1</span>
                <strong>Dados de Acesso</strong>
              </div>
              <div className="uf-field">
                <label>Nome Completo</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined">person</span>
                  <input type="text" className="uf-input" placeholder="ex: Mariana Souza" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
              </div>
              <div className="uf-field">
                <label>E-mail</label>
                <div className="uf-input-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input type="email" className="uf-input" placeholder="ex: mariana@exemplo.com.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="uf-field">
                  <label>Senha</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined">lock</span>
                    <input type="password" className="uf-input" placeholder="Mínimo 8 dígitos" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                  </div>
                </div>
                <div className="uf-field">
                  <label>Confirmar Senha</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined">lock_reset</span>
                    <input type="password" className="uf-input" placeholder="Repita a senha" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span className="uf-chip" style={{ cursor: 'default', width: 24, height: 24, padding: 0, justifyContent: 'center' }}>2</span>
                <strong>Perfil Biométrico e Físico</strong>
              </div>
              <div className="uf-field">
                <label>Sexo Biológico</label>
                <div className="uf-gender">
                  <button type="button" className={sexo === 'Feminino' ? 'ativo' : ''} onClick={() => setSexo('Feminino')}>
                    <span className="material-symbols-outlined">female</span> Feminino
                  </button>
                  <button type="button" className={sexo === 'Masculino' ? 'ativo' : ''} onClick={() => setSexo('Masculino')}>
                    <span className="material-symbols-outlined">male</span> Masculino
                  </button>
                  <button type="button" className={sexo === 'Outro' ? 'ativo' : ''} onClick={() => setSexo('Outro')}>
                    <span className="material-symbols-outlined">transgender</span> Outro
                  </button>
                </div>
                <input type="text" value={sexo} required readOnly style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="uf-field">
                  <label>Altura</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined">height</span>
                    <input type="text" className="uf-input" placeholder="1.68" value={altura} onChange={(e) => setAltura(e.target.value)} required />
                  </div>
                </div>
                <div className="uf-field">
                  <label>Peso Corporal Atual</label>
                  <div className="uf-input-icon">
                    <span className="material-symbols-outlined">fitness_center</span>
                    <input type="text" className="uf-input" placeholder="62.5" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                  </div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', fontSize: 13 }}>
                <input type="checkbox" checked={termos} onChange={(e) => setTermos(e.target.checked)} />
                Li e concordo com os Termos de Uso e a Política de Privacidade da UniFit.
              </label>
              <button id="btncadastrar" className="uf-btn-primary" type="submit">
                Concluir Cadastro e Começar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
            <p className="uf-muted" style={{ marginTop: 16, textAlign: 'center' }}>
              Já possui uma conta ativa? <Link to="/login" style={{ color: '#C30505', fontWeight: 600 }}>Fazer Login</Link>
            </p>
          </div>
          <aside className="uf-auth-side">
            <div className="uf-card" style={{ padding: 20, border: 0 }}>
              <div style={{ width: 40, height: 40, marginBottom: 12, background: '#ffdad5', color: '#c30505', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
                <span className="material-symbols-outlined">shield</span>
              </div>
              <h3 style={{ fontSize: 18 }}>Por que pedimos seus dados corporais?</h3>
              <p className="uf-muted" style={{ marginTop: 8 }}>Eles são utilizados exclusivamente pelos instrutores da sua unidade para individualizar suas metas de volume e progressão de carga.</p>
            </div>
            <div className="uf-card" style={{ padding: 20, border: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--uf-font-title)', fontSize: 11, fontWeight: 700 }}>
                <span>Precisão dos treinos</span>
                <span style={{ color: '#005cba' }}>Tempo Real</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 8px', fontFamily: 'var(--uf-font-title)', fontSize: 12 }}>
                <span>Adaptação 1RM</span>
                <b style={{ color: '#c30505' }}>+18%</b>
              </div>
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: 56, color: '#c30505' }}>
                <path d="M0 50 Q 30 45, 60 38 T 120 25 T 160 18 T 200 8" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M0 50 Q 30 45, 60 38 T 120 25 T 160 18 T 200 8 L 200 60 L 0 60 Z" fill="currentColor" fillOpacity="0.08" />
              </svg>
            </div>
            <p className="uf-muted" style={{ fontSize: 12 }}>Dúvidas no preenchimento? Converse com a recepção da sua unidade UniFit.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
