import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { groupListsById, swalDark } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';

export default function MyLists() {
  const { payload, request } = useAuth();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [criarAberto, setCriarAberto] = useState(false);
  const [detalheLista, setDetalheLista] = useState(null);
  const [nomeLista, setNomeLista] = useState('');
  const [tipoLista, setTipoLista] = useState('');

  async function carregar() {
    const obj = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      setListaExer(obj.dados || []);
    } else {
      alert('Login invalido!');
    }
  }

  useEffect(() => {
    carregar();
  }, [payload.usuarioId, request]);

  async function criarLista() {
    const obj = await request('/lista/create', {
      method: 'post',
      body: JSON.stringify({
        nome: nomeLista,
        tipo: tipoLista,
        usuarioId: payload.usuarioId
      })
    });
    setCriarAberto(false);
    setNomeLista('');
    setTipoLista('');
    if (obj.status === true) {
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Lista criada com sucesso!',
        icon: 'success'
      });
      carregar();
    } else {
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Erro ao criar a lista!',
        icon: 'error'
      });
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
    Swal.fire({
      ...swalDark,
      title: 'Excluida!',
      text: 'Sua lista de exercicio foi excluida.',
      icon: 'success'
    });
    carregar();
  }

  async function removerExercicio(exercicio) {
    await request('/lista/exercicios/delete/' + exercicio.id_lista + '/' + exercicio.id_exercicio, {
      method: 'delete'
    });
    const atualizada = detalheLista.filter((item) => item.id_exercicio !== exercicio.id_exercicio);
    setDetalheLista(atualizada);
    carregar();
  }

  const agrupadas = groupListsById(listaExer);

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Minhas listas</h1>
          <p>Crie treinos pessoais e organize os exercícios do catálogo.</p>
        </div>
        <button type="button" className="uf-btn-primary" id="Create-lista" onClick={() => setCriarAberto(true)}>
          <span className="material-symbols-outlined">add</span>
          Nova lista
        </button>
      </div>

      {listaExer.length === 0 ? (
        <p className="uf-empty uf-card">Nenhuma lista encontrada!</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => {
            const lista = agrupadas[idLista];
            return (
              <article className="uf-card uf-list-card" key={idLista}>
                <h3 style={{ cursor: 'pointer' }} onClick={() => setDetalheLista(lista)}>{lista[0].nome_lista}</h3>
                <ul>
                  {lista.map((exercicio) => (
                    <li key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                      {exercicio.nome_exercicio}
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
              <div className="uf-field">
                <label>Nome</label>
                <input className="uf-input" placeholder="Nome da Lista" value={nomeLista} onChange={(e) => setNomeLista(e.target.value)} />
              </div>
              <div className="uf-field">
                <label>Tipo</label>
                <select id="txtTipo" className="uf-select" required value={tipoLista} onChange={(e) => setTipoLista(e.target.value)}>
                  <option value="" disabled>Tipo</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
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
                    <th>Músculo Trabalhado</th>
                    <th>Equipamento</th>
                    <th>Dificuldade</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {detalheLista.map((exercicio) => (
                    <tr key={exercicio.id_exercicio}>
                      <td>{exercicio.nome_exercicio}</td>
                      <td>{exercicio.musculo_trabalhado}</td>
                      <td>{exercicio.equipamento}</td>
                      <td>{exercicio.dificuldade}</td>
                      <td>
                        <button type="button" className="uf-btn-danger" onClick={() => removerExercicio(exercicio)}>Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
