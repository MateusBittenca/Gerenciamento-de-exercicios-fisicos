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

export default function AddExerciseToList() {
  const { request } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [filtroMusculo, setFiltroMusculo] = useState('');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [listasModal, setListasModal] = useState(null);
  const [listas, setListas] = useState([]);
  const [escolha, setEscolha] = useState(null);
  const [salvando, setSalvando] = useState(false);

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
    const obj = await request('/listas/read', { method: 'get' });
    if (obj.status === true) {
      const fichas = fichasParaModal(obj.dados || []);
      setListas(fichas);
      setEscolha(escolhaInicialModal(fichas, exercicio.idexercicio));
      setListasModal(exercicio);
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar as listas.');
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
        toast('ok', 'Exercício adicionado à lista.');
        setListasModal(null);
      } else {
        toast('erro', obj.msg || 'Não foi possível adicionar.');
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

  return (
    <>
      <div className="uf-page-head">
        <div>
          <h1>Adicionar exercícios</h1>
          <p>Escolha um exercício e a lista oficial de destino.</p>
        </div>
        <button type="button" className="uf-btn-ghost" id="voltar" onClick={() => navigate('/admin/listas')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Voltar
        </button>
      </div>

      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="busca" className="uf-input" placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="uf-chips" id="filtro" style={{ marginBottom: 24 }}>
        <button type="button" className={'uf-chip' + (!filtroMusculo && !busca ? ' ativo' : '')} onClick={() => { setFiltroMusculo(''); setBusca(''); }}>Todos</button>
        {FILTROS.map((filtro) => (
          <button key={filtro.value} type="button" className={'uf-chip' + (filtroMusculo === filtro.value && !busca ? ' ativo' : '')} onClick={() => { setFiltroMusculo(filtro.value); setBusca(''); }}>
            {filtro.label}
          </button>
        ))}
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
          />
        ))}
      </div>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />

      <AddToListModal
        exercicio={listasModal}
        listas={listas}
        escolha={escolha}
        onEscolher={setEscolha}
        salvando={salvando}
        buscaPlaceholder="Buscar listas oficiais..."
        criarLabel="Criar nova lista oficial"
        onClose={() => setListasModal(null)}
        onConfirm={adicionarNaLista}
        onCreate={() => { setListasModal(null); navigate('/admin/listas'); }}
      />
    </>
  );
}
