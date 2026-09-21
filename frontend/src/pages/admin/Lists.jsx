import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { defaultPrescricao, exerciciosDaLista, formatDias, formatPrescricao, groupListsById, OBJETIVOS } from '../../api/client';
import ListaCard from '../../components/ListaCard';
import PrescriptionFields from '../../components/PrescriptionFields';
import WeekdayToggles from '../../components/WeekdayToggles';

export default function AdminLists() {
  const { request } = useAuth();
  const { toast, confirmar } = useFeedback();
  const navigate = useNavigate();
  const [listaExer, setListaExer] = useState([]);
  const [criarAberto, setCriarAberto] = useState(false);
  const [detalheLista, setDetalheLista] = useState(null);
  const [nomeLista, setNomeLista] = useState('');
  const [tipoLista, setTipoLista] = useState('A');
  const [objetivoLista, setObjetivoLista] = useState('hipertrofia');
  const [dias, setDias] = useState([]);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    const obj = await request('/listas/read', { method: 'get' });
    if (obj.status === true) {
      setListaExer(obj.dados || []);
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar as listas.');
    }
  }

  useEffect(() => {
    carregar();
  }, [request]);

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
        dias_semana: formatDias(dias)
      })
    });
    setCriarAberto(false);
    setNomeLista('');
    setTipoLista('A');
    setObjetivoLista('hipertrofia');
    setDias([]);
    if (obj.status === true) {
      toast('ok', 'Lista criada. Adicione exercícios em seguida.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível criar a lista.');
    }
  }

  async function excluirLista(lista) {
    const ok = await confirmar({
      titulo: 'Excluir esta lista oficial?',
      texto: 'Os exercícios saem dela. Essa ação não pode ser desfeita.',
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
    setDetalheLista(detalheLista.filter((item) => item.id_exercicio !== exercicio.id_exercicio));
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

  const agrupadas = groupListsById(listaExer);

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Listas de treino</h1>
          <p>Listas oficiais visíveis para os alunos.</p>
        </div>
        <div className="uf-actions">
          <button type="button" className="uf-btn-primary" id="Create-lista" onClick={() => setCriarAberto(true)}>
            <span className="material-symbols-outlined">add</span>
            Nova lista
          </button>
          <Link to="/admin/listas/adicionar" className="uf-btn-outline">Adicionar exercícios</Link>
        </div>
      </div>

      {Object.keys(agrupadas).length === 0 ? (
        <div className="uf-empty uf-card">
          <p>Nenhuma lista oficial ainda.</p>
          <button type="button" className="uf-btn-primary" onClick={() => setCriarAberto(true)}>Criar primeira lista</button>
        </div>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => (
            <ListaCard
              key={idLista}
              lista={agrupadas[idLista]}
              onAbrir={() => setDetalheLista(agrupadas[idLista])}
              onAdicionar={() => navigate('/admin/listas/adicionar')}
            />
          ))}
        </div>
      )}

      {criarAberto && (
        <div className="uf-modal" onClick={() => setCriarAberto(false)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setCriarAberto(false)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Criar lista</h2>
              <input className="uf-input" placeholder="Nome da Lista" value={nomeLista} onChange={(e) => setNomeLista(e.target.value)} />
              <select className="uf-select" value={objetivoLista} onChange={(e) => setObjetivoLista(e.target.value)}>
                {OBJETIVOS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <select id="txtTipo" className="uf-select" required value={tipoLista} onChange={(e) => setTipoLista(e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <WeekdayToggles value={dias} onChange={setDias} />
              <button type="submit" className="uf-btn-primary" onClick={criarLista}>Criar</button>
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
                <button type="button" className="uf-btn-outline" onClick={() => { setDetalheLista(null); navigate('/admin/listas/adicionar'); }}>Adicionar exercícios</button>
                <button type="button" className="uf-btn-danger" onClick={() => excluirLista(detalheLista)}>Excluir lista</button>
              </div>
            </div>
            <div className="uf-table-wrap">
              <table className="uf-table">
                <thead>
                  <tr>
                    <th>Nome do Exercício</th>
                    <th>Prescrição</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciciosDaLista(detalheLista).length === 0 ? (
                    <tr><td colSpan="3" className="uf-empty">Vazia. Adicione exercícios pelo catálogo oficial.</td></tr>
                  ) : exerciciosDaLista(detalheLista).map((exercicio) => (
                    <tr key={exercicio.id_exercicio}>
                      <td>{exercicio.nome_exercicio}</td>
                      <td>{formatPrescricao(exercicio)}</td>
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
              <PrescriptionFields value={editando} onChange={setEditando} />
              <button type="button" className="uf-btn-primary" onClick={salvarPrescricao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
