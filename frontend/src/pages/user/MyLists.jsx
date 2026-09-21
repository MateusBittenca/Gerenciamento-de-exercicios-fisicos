import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { defaultPrescricao, formatDias, groupListsById, OBJETIVOS } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import ListaCard from '../../components/ListaCard';
import PrescriptionFields from '../../components/PrescriptionFields';
import WeekdayToggles from '../../components/WeekdayToggles';

export default function MyLists() {
  const { payload, request, refreshSessao } = useAuth();
  const { toast, confirmar } = useFeedback();
  const navigate = useNavigate();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [criarAberto, setCriarAberto] = useState(false);
  const [detalheLista, setDetalheLista] = useState(null);
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
    setDetalheLista(null);
    toast('ok', 'Lista excluída.');
    carregar();
  }

  async function removerExercicio(exercicio) {
    await request('/lista/exercicios/delete/' + exercicio.id_lista + '/' + exercicio.id_exercicio, {
      method: 'delete'
    });
    const atualizada = detalheLista.filter((item) => item.id_exercicio !== exercicio.id_exercicio);
    setDetalheLista(atualizada.length ? atualizada : detalheLista);
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
      if (detalheLista) {
        setDetalheLista(detalheLista.map((item) => item.id_lista_exercicio === editando.id_lista_exercicio ? { ...item, ...editando } : item));
      }
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

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Minhas listas</h1>
          <p>Monte a rotina, prescreva séries e comece o treino quando quiser.</p>
        </div>
        <button type="button" className="uf-btn-primary" id="Create-lista" onClick={() => setCriarAberto(true)}>
          <span className="material-symbols-outlined">add</span>
          Nova lista
        </button>
      </div>

      {Object.keys(agrupadas).length === 0 ? (
        <div className="uf-empty uf-card">
          <p>Você ainda não tem listas pessoais.</p>
          <button type="button" className="uf-btn-primary" onClick={() => setCriarAberto(true)}>Criar primeira lista</button>
        </div>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => (
            <ListaCard
              key={idLista}
              lista={agrupadas[idLista]}
              onAbrir={() => setDetalheLista(agrupadas[idLista])}
              onIniciar={() => iniciar(agrupadas[idLista][0].id_lista)}
            />
          ))}
        </div>
      )}

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

      {criarAberto && (
        <div className="uf-modal" onClick={() => setCriarAberto(false)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setCriarAberto(false)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Nova lista</h2>
              <p className="uf-muted">Depois você escolhe os exercícios no catálogo.</p>
              <div className="uf-field">
                <label>Nome</label>
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
              <button type="submit" className="uf-btn-primary" onClick={criarLista}>Criar lista</button>
            </div>
          </div>
        </div>
      )}

      {detalheLista && (
        <div className="uf-modal" onClick={() => setDetalheLista(null)}>
          <div className="uf-modal-card largo" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setDetalheLista(null)}>&times;</button>
            <div className="uf-page-head">
              <h2>{detalheLista[0].nome_lista}</h2>
              <div className="uf-actions">
                <button type="button" className="uf-btn-outline" onClick={() => { setDetalheLista(null); navigate('/app/exercicios'); }}>Adicionar exercícios</button>
                <button type="button" className="uf-btn-primary" onClick={() => iniciar(detalheLista[0].id_lista)} disabled={!detalheLista.some((item) => item.id_exercicio)}>Iniciar</button>
                <button type="button" className="uf-btn-danger" onClick={() => excluirLista(detalheLista)}>Excluir lista</button>
              </div>
            </div>
            <div className="uf-table-wrap">
              <table className="uf-table">
                <thead>
                  <tr>
                    <th>Exercício</th>
                    <th>Séries × reps</th>
                    <th>Carga</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {detalheLista.filter((item) => item.id_exercicio).length === 0 ? (
                    <tr><td colSpan="4" className="uf-empty">Vazia. Use o catálogo para incluir exercícios.</td></tr>
                  ) : detalheLista.filter((item) => item.id_exercicio).map((exercicio) => (
                    <tr key={exercicio.id_exercicio}>
                      <td>{exercicio.nome_exercicio}</td>
                      <td>{exercicio.series}×{exercicio.reps}</td>
                      <td>{exercicio.carga_atual || exercicio.carga_kg ? (exercicio.carga_atual || exercicio.carga_kg) + ' kg' : '—'}</td>
                      <td>
                        <div className="uf-actions">
                          <button type="button" className="uf-btn-edit" onClick={() => setEditando({ ...defaultPrescricao(detalheLista[0].objetivo), ...exercicio })}>Editar</button>
                          <button type="button" className="uf-btn-danger" onClick={() => removerExercicio(exercicio)}>Remover</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
