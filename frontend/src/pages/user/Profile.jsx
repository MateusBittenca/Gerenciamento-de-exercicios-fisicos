import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import {
  alturaCm,
  alturaMetros,
  calcularImc,
  classificarImc,
  formatarMesAno,
  idadeDe,
  isoDate,
  matriculaUf,
  OBJETIVO_USUARIO
} from '../../api/client';

const SEXOS = ['Feminino', 'Masculino', 'Outro'];

function markerImc(imc) {
  const v = Number(imc);
  if (!v) {
    return 50;
  }
  if (v < 18.5) {
    return Math.max(4, (v / 18.5) * 30);
  }
  if (v < 25) {
    return 30 + ((v - 18.5) / 6.5) * 45;
  }
  return Math.min(96, 75 + ((v - 25) / 15) * 25);
}

export default function Profile() {
  const { payload, request, patchPayload } = useAuth();
  const { toast } = useFeedback();
  const fotoRef = useRef(null);
  const [usuario, setUsuario] = useState(null);
  const [afericoes, setAfericoes] = useState([]);
  const [treinosMes, setTreinosMes] = useState(0);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    sexo: '',
    alturaCm: '',
    peso: '',
    objetivo: '',
    metaSemanal: 4,
    foto: ''
  });

  function montarForm(dados) {
    return {
      nome: dados.Nome || '',
      email: dados.Email || '',
      telefone: dados.Telefone || '',
      dataNascimento: isoDate(dados.DataNascimento),
      sexo: dados.Sexo || '',
      alturaCm: alturaCm(dados.Altura) || '',
      peso: dados.Peso || '',
      objetivo: dados.Objetivo || '',
      metaSemanal: dados.MetaSemanal || 4,
      foto: dados.Foto || ''
    };
  }

  async function carregar() {
    const obj = await request('/usuario/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      const dados = Array.isArray(obj.dados) ? obj.dados[0] : obj.dados;
      setUsuario(dados);
      setForm(montarForm(dados));
      if (dados.Foto) {
        patchPayload({ foto: dados.Foto, nome: dados.Nome });
      }
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar o perfil.');
    }
    const hist = await request('/usuario/' + payload.usuarioId + '/afericoes', { method: 'get' });
    if (hist.status === true) {
      setAfericoes(hist.dados || []);
    }
    const resumo = await request('/treino/resumo', { method: 'get' });
    if (resumo.status === true) {
      setTreinosMes((resumo.dados && resumo.dados.concluidasMes) || 0);
    }
  }

  useEffect(() => {
    carregar();
  }, [payload.usuarioId]);

  function setCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  const metros = alturaMetros(form.alturaCm);
  const imc = calcularImc(form.peso, metros);
  const classeImc = classificarImc(imc);
  const idade = idadeDe(form.dataNascimento);
  const meta = Number(form.metaSemanal) || 4;
  const semanas = Math.max(1, Math.ceil(new Date().getDate() / 7));
  const previstos = meta * semanas;
  const assiduidade = previstos > 0 ? Math.round((treinosMes / previstos) * 100) : 0;
  const consistente = assiduidade >= 80;

  const delta30 = useMemo(() => {
    const agora = Date.now();
    const corte = agora - 30 * 24 * 60 * 60 * 1000;
    const antigas = afericoes.filter((item) => new Date(item.created_at).getTime() <= corte);
    const base = (antigas[0] || afericoes[afericoes.length - 1] || {}).peso;
    if (base == null || form.peso === '' || form.peso == null) {
      return null;
    }
    return Number((parseFloat(form.peso) - parseFloat(base)).toFixed(1));
  }, [afericoes, form.peso]);

  async function salvar() {
    const obj = await request('/usuario/' + payload.usuarioId, {
      method: 'put',
      body: JSON.stringify({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        dataNascimento: form.dataNascimento || null,
        sexo: form.sexo,
        altura: metros,
        peso: form.peso,
        objetivo: form.objetivo,
        metaSemanal: form.metaSemanal,
        foto: form.foto
      })
    });
    if (obj.status === true) {
      patchPayload({
        nome: form.nome,
        email: form.email,
        sexo: form.sexo,
        altura: metros,
        peso: form.peso,
        foto: form.foto,
        objetivo: form.objetivo,
        metaSemanal: form.metaSemanal
      });
      toast('ok', 'Perfil atualizado.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível salvar.');
    }
  }

  function descartar() {
    if (usuario) {
      setForm(montarForm(usuario));
    }
  }

  async function enviarFoto(arquivo) {
    if (!arquivo) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const obj = await request('/usuario/' + payload.usuarioId + '/foto', {
        method: 'post',
        body: JSON.stringify({ foto: reader.result })
      });
      if (obj.status === true && obj.dados && obj.dados.foto) {
        setForm((atual) => ({ ...atual, foto: obj.dados.foto }));
        patchPayload({ foto: obj.dados.foto });
        toast('ok', 'Foto atualizada.');
      } else {
        toast('erro', obj.msg || 'Não foi possível atualizar a foto.');
      }
    };
    reader.readAsDataURL(arquivo);
  }

  const nome = form.nome || payload?.nome || 'Aluno';
  const inicial = nome.trim().charAt(0).toUpperCase();

  return (
    <div className="uf-profile-page">
      <section className="uf-card uf-profile-hero">
        <div className="uf-profile-hero-main">
          <div className="uf-profile-avatar-wrap">
            {form.foto ? (
              <img className="uf-profile-avatar" src={form.foto} alt={nome} />
            ) : (
              <div className="uf-profile-avatar uf-avatar">{inicial}</div>
            )}
            <button type="button" className="uf-profile-cam" onClick={() => fotoRef.current && fotoRef.current.click()} title="Alterar foto">
              <span className="material-symbols-outlined">photo_camera</span>
            </button>
            <input ref={fotoRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => enviarFoto(e.target.files[0])} />
          </div>
          <div>
            <div className="uf-profile-name-row">
              <h1>{nome}</h1>
              <span className="uf-badge ok">Aluno Ativo</span>
              <span className="uf-badge soft">Aluno UniFit</span>
            </div>
            <p className="uf-profile-meta">
              <span><span className="material-symbols-outlined">badge</span> Matrícula: <strong>{matriculaUf(payload.usuarioId)}</strong></span>
              <span>·</span>
              <span><span className="material-symbols-outlined">event_available</span> Membro desde {formatarMesAno(usuario && usuario.createdAt)}</span>
              <span>·</span>
              <span><span className="material-symbols-outlined">bolt</span> Meta semanal: {meta}x</span>
            </p>
          </div>
        </div>
      </section>

      <section className="uf-profile-metrics">
        <article className="uf-card uf-metric">
          <div className="uf-metric-head">
            <div>
              <span className="uf-muted">Peso atual</span>
              <div className="uf-metric-value">{form.peso || '—'} <small>kg</small></div>
            </div>
            <span className="material-symbols-outlined">monitor_weight</span>
          </div>
          <p className="uf-metric-foot">
            {delta30 == null ? 'Sem histórico de 30 dias' : (delta30 > 0 ? '+' : '') + String(delta30).replace('.', ',') + ' kg (30 dias)'}
          </p>
        </article>
        <article className="uf-card uf-metric">
          <div className="uf-metric-head">
            <div>
              <span className="uf-muted">Estatura</span>
              <div className="uf-metric-value">{metros || '—'} <small>m</small></div>
            </div>
            <span className="material-symbols-outlined">height</span>
          </div>
          <p className="uf-metric-foot">{form.alturaCm ? form.alturaCm + ' cm' : 'Informe a altura'}</p>
        </article>
        <article className="uf-card uf-metric">
          <div className="uf-metric-head">
            <div>
              <span className="uf-muted">IMC corporal</span>
              <div className="uf-metric-value">{imc || '—'} <small>kg/m²</small></div>
            </div>
            <span className={'uf-badge ' + classeImc.tom}>{classeImc.label}</span>
          </div>
          <div className="uf-imc-bar">
            <i style={{ left: markerImc(imc) + '%' }} />
          </div>
          <div className="uf-imc-labels">
            <span>18.5</span>
            <span>Peso saudável</span>
            <span>24.9</span>
          </div>
        </article>
        <article className="uf-card uf-metric">
          <div className="uf-metric-head">
            <div>
              <span className="uf-muted">Assiduidade mensal</span>
              <div className="uf-metric-value">{assiduidade}% <small>de presença</small></div>
            </div>
            <span className="material-symbols-outlined">sports_score</span>
          </div>
          <p className="uf-metric-foot">
            {treinosMes} de {previstos} treinos previstos
            <strong>{consistente ? 'Consistente' : 'Em evolução'}</strong>
          </p>
        </article>
      </section>

      <div className="uf-profile-grid">
        <section className="uf-card uf-profile-block">
          <h2>Dados cadastrais & acesso</h2>
          <p className="uf-muted">Informações oficiais de identificação e contato.</p>
          <div className="uf-field">
            <label>Nome completo</label>
            <input className="uf-input" value={form.nome} onChange={(e) => setCampo('nome', e.target.value)} />
          </div>
          <div className="uf-field">
            <label>E-mail</label>
            <input className="uf-input" type="email" value={form.email} onChange={(e) => setCampo('email', e.target.value)} />
          </div>
          <div className="uf-profile-2">
            <div className="uf-field">
              <label>Telefone</label>
              <input className="uf-input" value={form.telefone} onChange={(e) => setCampo('telefone', e.target.value)} placeholder="(00) 00000-0000" />
            </div>
            <div className="uf-field">
              <label>Nascimento {idade != null ? '(' + idade + ' anos)' : ''}</label>
              <input className="uf-input" type="date" value={form.dataNascimento} onChange={(e) => setCampo('dataNascimento', e.target.value)} />
            </div>
          </div>
          <div className="uf-profile-2">
            <div className="uf-field">
              <label>Matrícula</label>
              <input className="uf-input" value={matriculaUf(payload.usuarioId)} readOnly />
            </div>
            <div className="uf-field">
              <label>Unidade</label>
              <input className="uf-input" value="UniFit" readOnly />
            </div>
          </div>
          <p className="uf-muted" style={{ fontSize: 12 }}>Dados pessoais usados só para personalizar treinos, conforme a LGPD.</p>
        </section>

        <section className="uf-card uf-profile-block">
          <h2>Dados biométricos</h2>
          <p className="uf-muted">Usados no cálculo de IMC e na prescrição.</p>
          <div className="uf-field">
            <label>Sexo</label>
            <div className="uf-gender">
              {SEXOS.map((item) => (
                <button key={item} type="button" className={form.sexo === item ? 'ativo' : ''} onClick={() => setCampo('sexo', item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="uf-profile-2">
            <div className="uf-field">
              <label>Altura (cm)</label>
              <input className="uf-input" type="number" value={form.alturaCm} onChange={(e) => setCampo('alturaCm', e.target.value)} />
            </div>
            <div className="uf-field">
              <label>Peso (kg)</label>
              <input className="uf-input" type="number" step="0.1" value={form.peso} onChange={(e) => setCampo('peso', e.target.value)} />
            </div>
          </div>
          <div className="uf-field">
            <label>Objetivo</label>
            <select className="uf-select" value={form.objetivo} onChange={(e) => setCampo('objetivo', e.target.value)}>
              <option value="">Selecione</option>
              {OBJETIVO_USUARIO.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div className="uf-field">
            <label>Meta semanal (1–7)</label>
            <input className="uf-input" type="number" min="1" max="7" value={form.metaSemanal} onChange={(e) => setCampo('metaSemanal', e.target.value)} />
          </div>
        </section>
      </div>

      <section className="uf-card uf-profile-block">
        <h2>Histórico de aferições</h2>
        <div className="uf-table-wrap">
          <table className="uf-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso</th>
                <th>Altura</th>
                <th>IMC</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {afericoes.length === 0 ? (
                <tr><td colSpan="5" className="uf-empty">Nenhuma aferição registrada.</td></tr>
              ) : afericoes.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>{item.peso} kg</td>
                  <td>{item.altura} m</td>
                  <td>{item.imc}</td>
                  <td>Autoavaliação</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="uf-profile-sticky">
        <button type="button" className="uf-btn-ghost" onClick={descartar}>Descartar</button>
        <button type="button" className="uf-btn-primary" onClick={salvar}>Salvar Alterações</button>
      </div>
    </div>
  );
}
