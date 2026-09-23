import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { defaultPrescricao, exerciciosDaLista, formatDias, formatPrescricao, groupListsById, listaProgramadaHoje, OBJETIVOS } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import PrescriptionFields from '../../components/PrescriptionFields';
import WeekdayToggles from '../../components/WeekdayToggles';

export default function MyLists() {
  const { payload, request, refreshSessao } = useAuth();
  const { toast, confirmar } = useFeedback();
  const navigate = useNavigate();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [criarAberto, setCriarAberto] = useState(false);
  const [nomeLista, setNomeLista] = useState('');
  const [tipoLista, setTipoLista] = useState('A');
  const [objetivoLista, setObjetivoLista] = useState('hipertrofia');
  const [dias, setDias] = useState([]);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    const obj = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      setListaExer(obj.dados || []);
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar suas listas.');
    }
  }

  useEffect(() => {
    carregar();
  }, [payload.usuarioId, request]);

  async function criarLista() {
    if (!nomeLista.trim()) {
      toast('info', 'Dê um nome à lista.');
      return;
    }
    const obj = await request('/lista/create', {
      method: 'post',
      body: JSON.stringify({
        nome: nomeLista,
        tipo: tipoLista,
        objetivo: objetivoLista,
        dias_semana: formatDias(dias),
        usuarioId: payload.usuarioId
      })
    });
    setCriarAberto(false);
    setNomeLista('');
    setTipoLista('A');
    setObjetivoLista('hipertrofia');
    setDias([]);
    if (obj.status === true) {
      toast('ok', 'Lista criada. Adicione exercícios pelo catálogo.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível criar a lista.');
    }
  }

  async function excluirLista(lista) {
    const ok = await confirmar({
      titulo: 'Excluir esta lista?',
      texto: 'Os exercícios saem dela. Isso não pode ser desfeito.',
      confirma: 'Excluir',
      perigo: true
    });
    if (!ok) {
      return;
    }
    const idLista = lista[0].id_lista;
    await request('/lista/exercicios/deleteAll/' + idLista, { method: 'delete' });
    await request('/lista/delete/' + idLista, { method: 'delete' });
    toast('ok', 'Lista excluída.');
    carregar();
  }

  async function removerExercicio(exercicio) {
    await request('/lista/exercicios/delete/' + exercicio.id_lista + '/' + exercicio.id_exercicio, {
      method: 'delete'
    });
    toast('ok', 'Exercício removido.');
    carregar();
  }

  async function salvarPrescricao() {
    const obj = await request('/lista/exercicios/update', {
      method: 'put',
      body: JSON.stringify({
        id: editando.id_lista_exercicio,
        series: editando.series,
        reps: editando.reps,
        carga_kg: editando.carga_kg || null,
        descanso_seg: editando.descanso_seg
      })
    });
    if (obj.status === true) {
      setEditando(null);
      toast('ok', 'Prescrição atualizada.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível salvar.');
    }
  }

  async function iniciar(idLista) {
    const obj = await request('/treino/iniciar', {
      method: 'post',
      body: JSON.stringify({ idLista })
    });
    if (obj.status === true && obj.dados && obj.dados.sessao) {
      await refreshSessao();
      navigate('/app/treino/' + obj.dados.sessao.id);
    } else {
      toast('erro', obj.msg || 'Não foi possível iniciar o treino.');
    }
  }

  const agrupadas = groupListsById(listaExer);
  const ids = Object.keys(agrupadas);
  const totalExercicios = ids.reduce((acc, idLista) => acc + exerciciosDaLista(agrupadas[idLista]).length, 0);
  const hoje = ids.map((idLista) => agrupadas[idLista][0]).find((meta) => listaProgramadaHoje(meta));

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Minhas Listas de Treino</h1>
          <p>Gerencie suas rotinas, adicione exercícios e acompanhe o plano da semana.</p>
        </div>
        <button type="button" className="uf-btn-primary" id="Create-lista" onClick={() => setCriarAberto((v) => !v)}>
          <span className="material-symbols-outlined">add</span>
          Criar nova lista
        </button>
      </div>

      <div className="uf-stat-ribbon">
        <article className="uf-card uf-stat-item">
          <div className="uf-stat-item-main">
            <div className="uf-stat-icon">
              <span className="material-symbols-outlined">folder_special</span>
            </div>
            <div>
              <small>Listas montadas</small>
              <strong>{ids.length} rotinas ativas</strong>
            </div>
          </div>
        </article>
        <article className="uf-card uf-stat-item">
          <div className="uf-stat-item-main">
            <div className="uf-stat-icon azul">
              <span className="material-symbols-outlined">event_repeat</span>
            </div>
            <div>
              <small>Próxima sessão</small>
              <strong>{hoje ? hoje.nome_lista : 'Nenhuma hoje'}</strong>
            </div>
          </div>
          {hoje ? <span className="uf-badge-soft">Pronto</span> : <span className="uf-badge-muted">Livre</span>}
        </article>
        <article className="uf-card uf-stat-item">
          <div className="uf-stat-item-main">
            <div className="uf-stat-icon">
              <span className="material-symbols-outlined">exercise</span>
            </div>
            <div>
              <small>Volume nas listas</small>
              <strong>{totalExercicios} exercícios</strong>
            </div>
          </div>
        </article>
      </div>

      {criarAberto && (
        <section className="uf-card uf-create-panel">
          <div className="uf-create-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="uf-stat-icon" style={{ width: 32, height: 32, background: 'var(--uf-primary)', color: '#fff' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>playlist_add</span>
              </div>
              <div>
                <h2>Painel de criação rápida</h2>
                <p className="uf-muted" style={{ margin: 0 }}>Nome, objetivo e dias da semana. Os exercícios entram depois pelo catálogo.</p>
              </div>
            </div>
            <button type="button" className="uf-btn-ghost" onClick={() => setCriarAberto(false)} aria-label="Fechar">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="uf-modal-form">
            <div className="uf-field">
              <label>Nome da lista</label>
              <input className="uf-input" placeholder="Ex.: Peito e tríceps" value={nomeLista} onChange={(e) => setNomeLista(e.target.value)} />
            </div>
            <div className="uf-field">
              <label>Objetivo</label>
              <select className="uf-select" value={objetivoLista} onChange={(e) => setObjetivoLista(e.target.value)}>
                {OBJETIVOS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div className="uf-field">
              <label>Frequência</label>
              <select id="txtTipo" className="uf-select" required value={tipoLista} onChange={(e) => setTipoLista(e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="uf-field">
              <label>Dias da semana</label>
              <WeekdayToggles value={dias} onChange={setDias} />
            </div>
            <div className="uf-actions">
              <button type="button" className="uf-btn-ghost" onClick={() => setCriarAberto(false)}>Cancelar</button>
              <button type="button" className="uf-btn-primary" onClick={criarLista}>Salvar nova lista</button>
            </div>
          </div>
        </section>
      )}

      {ids.length === 0 && !criarAberto ? (
        <div className="uf-empty uf-card">
          <p>Você ainda não tem listas pessoais.</p>
          <button type="button" className="uf-btn-primary" onClick={() => setCriarAberto(true)}>Criar primeira lista</button>
        </div>
      ) : (
        ids.map((idLista) => {
          const lista = agrupadas[idLista];
          const meta = lista[0];
          const itens = exerciciosDaLista(lista);
          const objetivo = (OBJETIVOS.find((item) => item.value === meta.objetivo) || {}).label || meta.objetivo;
          return (
            <article key={idLista} className="uf-card uf-list-sheet">
              <div className="uf-list-sheet-head">
                <div className="uf-list-sheet-title">
                  <div className="uf-list-sheet-icon">
                    <span className="material-symbols-outlined">sports_gymnastics</span>
                  </div>
                  <div>
                    <div className="uf-actions" style={{ justifyContent: 'flex-start', marginBottom: 4 }}>
                      <h2 style={{ margin: 0 }}>{meta.nome_lista}</h2>
                      <span className="uf-badge-soft">Frequência {meta.tipo_lista}</span>
                      <span className="uf-badge-muted">{objetivo}</span>
                    </div>
                    <p className="uf-muted" style={{ margin: 0 }}>{itens.length} exercício{itens.length === 1 ? '' : 's'}</p>
                  </div>
                </div>
                <div className="uf-actions">
                  <button type="button" className="uf-btn-outline" onClick={() => iniciar(meta.id_lista)} disabled={itens.length === 0}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    Iniciar
                  </button>
                  <button type="button" className="uf-btn-ghost" onClick={() => navigate('/app/exercicios')}>Adicionar</button>
                  <button type="button" className="uf-btn-danger" onClick={() => excluirLista(lista)}>Excluir</button>
                </div>
              </div>
              <div className="uf-table-wrap">
                <table className="uf-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Exercício</th>
                      <th>Agrupamento</th>
                      <th>Prescrição</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.length === 0 ? (
                      <tr><td colSpan="5" className="uf-empty">Vazia. Use o catálogo para incluir exercícios.</td></tr>
                    ) : itens.map((exercicio, index) => (
                      <tr key={exercicio.id_exercicio}>
                        <td>{index + 1}</td>
                        <td>
                          <button type="button" className="uf-section-link" onClick={() => setSelecionado(exercicio)}>{exercicio.nome_exercicio}</button>
                        </td>
                        <td>{exercicio.musculo_trabalhado || exercicio.musculo || '—'}</td>
                        <td>{formatPrescricao(exercicio)}</td>
                        <td>
                          <div className="uf-actions">
                            <button type="button" className="uf-btn-edit" onClick={() => setEditando({ ...defaultPrescricao(meta.objetivo), ...exercicio })}>Editar</button>
                            <button type="button" className="uf-btn-danger" onClick={() => removerExercicio(exercicio)}>Remover</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          );
        })
      )}

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

      {editando && (
        <div className="uf-modal" onClick={() => setEditando(null)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setEditando(null)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Editar prescrição</h2>
              <p>{editando.nome_exercicio}</p>
              <PrescriptionFields value={editando} onChange={setEditando} />
              <button type="button" className="uf-btn-primary" onClick={salvarPrescricao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
