import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { defaultPrescricao, escolhaInicialModal, fichasParaModal, listaContemExercicio } from '../../api/client';
import AddToListModal from '../../components/AddToListModal';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';

const FILTROS = [
  { label: 'Biceps', value: 'Bíceps' },
  { label: 'Triceps', value: 'Tríceps' },
  { label: 'Peito', value: 'Peito' },
  { label: 'Costas', value: 'Costas' },
  { label: 'Quadriceps', value: 'Quadríceps' },
  { label: 'Ombro', value: 'Ombro' }
];

export default function Exercises() {
  const { payload, request } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [filtroMusculo, setFiltroMusculo] = useState('');
  const [busca, setBusca] = useState('');
  const [apenasFav, setApenasFav] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [listasModal, setListasModal] = useState(null);
  const [listas, setListas] = useState([]);
  const [escolha, setEscolha] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  async function carregarFav() {
    const obj = await request('/exerfav', { method: 'get' });
    if (obj.status === true) {
      setFavoritos((obj.dados || []).map((item) => item.exercicio_id || item.idexercicio));
    }
  }

  useEffect(() => {
    async function carregar() {
      const obj = await request('/exercicios', { method: 'get' });
      if (obj.status === true) {
        setExercicios(obj.dados || []);
      }
      carregarFav();
    }
    carregar();
  }, [request]);

  async function toggleFav(exercicio) {
    const id = exercicio.idexercicio;
    if (favoritos.includes(id)) {
      await request('/exerfav/' + id, { method: 'delete' });
    } else {
      await request('/exerfav', { method: 'post', body: JSON.stringify({ exercicioId: id }) });
    }
    carregarFav();
  }

  async function abrirListas(exercicio) {
    const obj = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      const fichas = fichasParaModal(obj.dados || []);
      setListas(fichas);
      setEscolha(escolhaInicialModal(fichas, exercicio.idexercicio));
      setListasModal(exercicio);
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar suas listas.');
    }
  }

  async function adicionarNaLista() {
    const lista = listas.find((item) => String(item.id) === String(escolha));
    if (!lista || salvando || listaContemExercicio(lista, listasModal.idexercicio)) {
      return;
    }
    setSalvando(true);
    const def = defaultPrescricao(lista.objetivo);
    try {
      const obj = await request('/lista/exercicios/create', {
        method: 'post',
        body: JSON.stringify({
          idListaExer: lista.id,
          idExercicios: listasModal.idexercicio,
          series: def.series,
          reps: def.reps,
          carga_kg: null,
          descanso_seg: def.descanso_seg
        })
      });
      if (obj.status === true) {
        toast('ok', 'Adicionado em ' + lista.nome + '.');
        setListasModal(null);
      } else {
        toast('erro', obj.msg || 'Esse exercício já está na lista.');
      }
    } finally {
      setSalvando(false);
    }
  }

  const textoBusca = busca.toLowerCase();
  let visiveis = filtroMusculo
    ? exercicios.filter((exercicio) => exercicio.musculo === filtroMusculo)
    : exercicios;

  if (textoBusca) {
    visiveis = visiveis.filter((exercicio) => exercicio.nome.toLowerCase().includes(textoBusca));
  }
  if (apenasFav) {
    visiveis = visiveis.filter((exercicio) => favoritos.includes(exercicio.idexercicio));
  }

  function contarMusculo(valor) {
    return exercicios.filter((exercicio) => exercicio.musculo === valor).length;
  }

  return (
    <>
      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="busca" className="uf-input" placeholder="Buscar por nome de exercício, equipamento ou músculo..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="uf-chips" id="filtro" style={{ marginBottom: 20 }}>
        <button type="button" className={'uf-chip' + (!filtroMusculo && !busca && !apenasFav ? ' ativo' : '')} onClick={() => { setFiltroMusculo(''); setBusca(''); setApenasFav(false); }}>
          Todos <span className="uf-chip-count">{exercicios.length}</span>
        </button>
        {FILTROS.map((filtro) => (
          <button key={filtro.value} type="button" className={'uf-chip' + (filtroMusculo === filtro.value && !busca ? ' ativo' : '')} onClick={() => { setFiltroMusculo(filtro.value); setBusca(''); }}>
            {filtro.label} <span className="uf-chip-count">{contarMusculo(filtro.value)}</span>
          </button>
        ))}
        <button type="button" className={'uf-chip' + (apenasFav ? ' ativo' : '')} onClick={() => setApenasFav((v) => !v)}>
          Favoritos <span className="uf-chip-count">{favoritos.length}</span>
        </button>
      </div>

      <div className="uf-grid-cards" id="card">
        {visiveis.length === 0 ? (
          <p className="uf-empty uf-card">Nenhum exercício encontrado.</p>
        ) : visiveis.map((exercicio) => (
          <ExerciseCard
            key={exercicio.idexercicio}
            exercicio={exercicio}
            onOpen={() => setSelecionado(exercicio)}
            onAdd={() => abrirListas(exercicio)}
            favorito={favoritos.includes(exercicio.idexercicio)}
            onFav={toggleFav}
          />
        ))}
      </div>

      <ExerciseModal
        exercicio={selecionado}
        onClose={() => setSelecionado(null)}
        favorito={selecionado ? favoritos.includes(selecionado.idexercicio) : false}
        onFav={toggleFav}
      />

      <AddToListModal
        exercicio={listasModal}
        listas={listas}
        escolha={escolha}
        onEscolher={setEscolha}
        salvando={salvando}
        alunoNome={payload.nome}
        onClose={() => setListasModal(null)}
        onConfirm={adicionarNaLista}
        onCreate={() => { setListasModal(null); navigate('/app/minhas-listas'); }}
      />
    </>
  );
}
