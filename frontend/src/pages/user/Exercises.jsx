import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { defaultPrescricao, swalDark } from '../../api/client';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';
import PrescriptionFields from '../../components/PrescriptionFields';

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
  const [exercicios, setExercicios] = useState([]);
  const [filtroMusculo, setFiltroMusculo] = useState('');
  const [busca, setBusca] = useState('');
  const [apenasFav, setApenasFav] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [listasModal, setListasModal] = useState(null);
  const [listas, setListas] = useState([]);
  const [presc, setPresc] = useState(defaultPrescricao('hipertrofia'));
  const [favoritos, setFavoritos] = useState([]);

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
    const obj = await request('/lista/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      setListas(obj.dados || []);
      setListasModal(exercicio);
      setPresc(defaultPrescricao('hipertrofia'));
    } else {
      alert('Erro ao buscar as listas.');
    }
  }

  async function adicionarNaLista(lista) {
    const def = defaultPrescricao(lista.objetivo);
    const obj = await request('/lista/exercicios/create', {
      method: 'post',
      body: JSON.stringify({
        idListaExer: lista.idlista,
        idExercicios: listasModal.idexercicio,
        series: presc.series || def.series,
        reps: presc.reps || def.reps,
        carga_kg: presc.carga_kg || null,
        descanso_seg: presc.descanso_seg || def.descanso_seg
      })
    });
    if (obj.status === true) {
      Swal.fire({ ...swalDark, title: 'Sucesso!', text: 'Exercicio adionado a lista!', icon: 'success' });
      setListasModal(null);
    } else {
      Swal.fire({ ...swalDark, title: 'Erro!', text: obj.msg || 'Erro ao adicionar exercicio na lista!', icon: 'error' });
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

  return (
    <>
      <div className="uf-page-head">
        <div>
          <h1>Catálogo de exercícios</h1>
          <p>Busque pelo nome ou filtre pelo músculo trabalhado.</p>
        </div>
      </div>

      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="busca" className="uf-input" placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="uf-chips" id="filtro" style={{ marginBottom: 24 }}>
        <button type="button" className={'uf-chip' + (!filtroMusculo && !busca && !apenasFav ? ' ativo' : '')} onClick={() => { setFiltroMusculo(''); setBusca(''); setApenasFav(false); }}>Todos</button>
        {FILTROS.map((filtro) => (
          <button key={filtro.value} type="button" className={'uf-chip' + (filtroMusculo === filtro.value && !busca ? ' ativo' : '')} onClick={() => { setFiltroMusculo(filtro.value); setBusca(''); }}>{filtro.label}</button>
        ))}
        <button type="button" className={'uf-chip' + (apenasFav ? ' ativo' : '')} onClick={() => setApenasFav((v) => !v)}>Favoritos</button>
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

      {listasModal && (
        <div className="uf-modal" onClick={() => setListasModal(null)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setListasModal(null)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Adicionar à lista</h2>
              <PrescriptionFields value={presc} onChange={setPresc} />
              {listas.length === 0 ? (
                <p className="uf-muted">Nenhuma lista pessoal encontrada.</p>
              ) : (
                <ul className="uf-pick-list">
                  {listas.map((lista) => (
                    <li key={lista.idlista} onClick={() => adicionarNaLista(lista)}>
                      <strong>{lista.nome}</strong>
                      <span className="uf-muted">{lista.tipo} · {lista.objetivo || 'hipertrofia'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
