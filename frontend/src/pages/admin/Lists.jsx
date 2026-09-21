import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { defaultPrescricao, exerciciosDaLista, formatDias, formatPrescricao, groupListsById, OBJETIVOS, swalDark } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import PrescriptionFields from '../../components/PrescriptionFields';
import WeekdayToggles from '../../components/WeekdayToggles';

export default function AdminLists() {
  const { request } = useAuth();
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
    const obj = await request('/listas/read', { method: 'get' });
    if (obj.status === true) {
      setListaExer(obj.dados || []);
    } else {
      alert('Login invalido!');
    }
  }

  useEffect(() => {
    carregar();
  }, [request]);

  async function criarLista() {
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
      Swal.fire({ ...swalDark, title: 'Sucesso!', text: 'Lista criada com sucesso!', icon: 'success' });
      carregar();
    } else {
      Swal.fire({ ...swalDark, title: 'Erro!', text: 'Erro ao criar a lista!', icon: 'error' });
    }
  }

  async function excluirLista(lista) {
    const result = await Swal.fire({
      ...swalDark,
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim!'
    });
    if (!result.isConfirmed) {
      return;
    }
    const idLista = lista[0].id_lista;
    await request('/lista/exercicios/deleteAll/' + idLista, { method: 'delete' });
    await request('/lista/delete/' + idLista, { method: 'delete' });
    setDetalheLista(null);
    Swal.fire({ ...swalDark, title: 'Excluida!', text: 'Sua lista de exercicio foi excluida.', icon: 'success' });
    carregar();
  }

  async function removerExercicio(exercicio) {
    await request('/lista/exercicios/delete/' + exercicio.id_lista + '/' + exercicio.id_exercicio, {
      method: 'delete'
    });
    setDetalheLista(detalheLista.filter((item) => item.id_exercicio !== exercicio.id_exercicio));
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
      carregar();
    }
  }

  const agrupadas = groupListsById(listaExer);
  const labelObjetivo = (valor) => (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor;

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
        <p className="uf-empty uf-card">Nenhuma lista encontrada!</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => {
            const lista = agrupadas[idLista];
            const meta = lista[0];
            const itens = exerciciosDaLista(lista);
            return (
              <article className="uf-card uf-list-card" key={idLista}>
                <div className="uf-chips" style={{ marginBottom: 8 }}>
                  <span className="uf-chip" style={{ cursor: 'default' }}>{labelObjetivo(meta.objetivo)}</span>
                  <span className="uf-chip" style={{ cursor: 'default' }}>Frequência {meta.tipo_lista}</span>
                </div>
                <h3 style={{ cursor: 'pointer' }} onClick={() => setDetalheLista(lista)}>{meta.nome_lista}</h3>
                <ul>
                  {itens.length === 0 ? (
                    <li className="uf-muted">Nenhum exercício ainda</li>
                  ) : itens.map((exercicio) => (
                    <li key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                      {exercicio.nome_exercicio}
                      <small className="uf-muted"> · {formatPrescricao(exercicio)}</small>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

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
              <button type="button" className="uf-btn-danger" onClick={() => excluirLista(detalheLista)}>Excluir lista</button>
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
                  {exerciciosDaLista(detalheLista).map((exercicio) => (
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
