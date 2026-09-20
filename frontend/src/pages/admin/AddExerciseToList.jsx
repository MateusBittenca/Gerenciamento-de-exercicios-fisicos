import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { swalDark } from '../../api/client';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';
import '../../css/exercicios.css';
import '../../css/modalExercicios.css';

const FILTROS = [
  { label: 'Biceps', value: 'Bíceps' },
  { label: 'Triceps', value: 'Tríceps' },
  { label: 'Peito', value: 'Peito' },
  { label: 'Costas', value: 'Costas' },
  { label: 'Quadriceps', value: 'Quadríceps' },
  { label: 'Ombro', value: 'Ombro' }
];

export default function AddExerciseToList() {
  const { request } = useAuth();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [filtroMusculo, setFiltroMusculo] = useState('');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [listasModal, setListasModal] = useState(null);
  const [listas, setListas] = useState([]);

  useEffect(() => {
    async function carregar() {
      const obj = await request('/exercicios', { method: 'get' });
      if (obj.status === true) {
        setExercicios(obj.dados || []);
      }
    }
    carregar();
  }, [request]);

  async function abrirListas(exercicio) {
    const obj = await request('/lista', { method: 'get' });
    if (obj.status === true) {
      setListas(obj.dados || []);
      setListasModal(exercicio);
    } else {
      alert('Erro ao buscar as listas.');
    }
  }

  async function adicionarNaLista(lista) {
    const obj = await request('/lista/exercicios/create', {
      method: 'post',
      body: JSON.stringify({
        idListaExer: lista.idlista,
        idExercicios: listasModal.idexercicio
      })
    });
    if (obj.status === true) {
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Exercicio adionado a lista!',
        icon: 'success'
      });
    } else {
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Erro ao adicionar exercicio na lista!',
        icon: 'error'
      });
    }
  }

  const textoBusca = busca.toLowerCase();
  let visiveis = filtroMusculo
    ? exercicios.filter((exercicio) => exercicio.musculo === filtroMusculo)
    : exercicios;

  if (textoBusca) {
    visiveis = exercicios.filter((exercicio) => exercicio.nome.toLowerCase().includes(textoBusca));
  }

  return (
    <>
      <div id="filtro">
        <button type="button" id="voltar" onClick={() => navigate('/admin/listas')}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <button type="button" className={!filtroMusculo && !busca ? 'filtro-ativo' : undefined} onClick={() => { setFiltroMusculo(''); setBusca(''); }}>Todos</button>
        {FILTROS.map((filtro) => (
          <button key={filtro.value} type="button" className={filtroMusculo === filtro.value && !busca ? 'filtro-ativo' : undefined} onClick={() => { setFiltroMusculo(filtro.value); setBusca(''); }}>
            {filtro.label}
          </button>
        ))}
        <input type="text" id="busca" placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="card-container" id="card">
        {visiveis.map((exercicio) => (
          <ExerciseCard
            key={exercicio.idexercicio}
            exercicio={exercicio}
            onOpen={() => setSelecionado(exercicio)}
            onAdd={() => abrirListas(exercicio)}
          />
        ))}
      </div>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

      {listasModal && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setListasModal(null)}>&times;</span>
            <h2>Listas de Exercícios</h2>
            <table className="exercise-table">
              <thead>
                <tr>
                  <th>Lista</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {listas.map((lista) => (
                  <tr key={lista.idlista} onClick={() => adicionarNaLista(lista)}>
                    <td>{lista.nome}</td>
                    <td>{lista.tipo}</td>
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
