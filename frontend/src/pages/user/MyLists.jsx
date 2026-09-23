import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { groupListsById, swalDark } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import '../../css/table.css';
import '../../css/lista.css';
import '../../css/modalExercicios.css';

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
      Swal.fire({
        ...swalDark,
        title: 'Sessão expirada!',
        text: 'Não foi possível carregar suas listas. Faça login novamente.',
        icon: 'error'
      });
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
    <>
      <div className="tabela">
        <div className="cabeca">
          <h1>Minhas Listas</h1>
          <img
            src="/image/alem-disso-positivo-adicionar-simbolo-matematico.png"
            alt=""
            id="Create-lista"
            onClick={() => setCriarAberto(true)}
          />
        </div>
        <br />
      </div>
      <div id="tabelaExercicios">
        {listaExer.length === 0 && (
          <tr>
            <td colSpan="2">nenhuma lista encontrada!</td>
          </tr>
        )}
        {Object.keys(agrupadas).map((idLista) => {
          const lista = agrupadas[idLista];
          return (
            <div className="container-tabela" key={idLista}>
              <table className="tabela-list">
                <thead>
                  <tr>
                    <th onClick={() => setDetalheLista(lista)}>{lista[0].nome_lista}</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((exercicio) => (
                    <tr key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                      <td>{exercicio.nome_exercicio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

      {criarAberto && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setCriarAberto(false)}>&times;</span>
            <h2>Criar Lista</h2>
            <input placeholder="Nome da Lista" value={nomeLista} onChange={(e) => setNomeLista(e.target.value)} />
            <select id="txtTipo" required value={tipoLista} onChange={(e) => setTipoLista(e.target.value)}>
              <option value="" disabled>Tipo</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <button type="submit" onClick={criarLista}>Criar</button>
          </div>
        </div>
      )}

      {detalheLista && (
        <div className="modal-lista aberto">
          <div className="modal-content-lista">
            <span className="close-button-lista" onClick={() => setDetalheLista(null)}>&times;</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2>{detalheLista[0].nome_lista}</h2>
              <i
                className="bi bi-trash-fill"
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => excluirLista(detalheLista)}
              ></i>
            </div>
            <br /><br />
            <table>
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
                      <button onClick={() => removerExercicio(exercicio)}>
                        <i className="bi bi-trash3-fill" style={{ cursor: 'pointer' }}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
