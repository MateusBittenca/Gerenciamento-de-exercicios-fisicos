import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { groupListsById, OBJETIVOS } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import ListaCard from '../../components/ListaCard';

export default function PublicLists() {
  const { request, refreshSessao } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroObjetivo, setFiltroObjetivo] = useState('');

  useEffect(() => {
    async function carregar() {
      const obj = await request('/listas/read', { method: 'get' });
      if (obj.status === true) {
        setListaExer(obj.dados || []);
      } else {
        toast('erro', obj.msg || 'Não foi possível carregar as listas oficiais.');
      }
    }
    carregar();
  }, [request]);

  async function salvarOficial(idLista) {
    const obj = await request('/lista/salvar-oficial', {
      method: 'post',
      body: JSON.stringify({ idLista })
    });
    if (obj.status === true) {
      toast('ok', 'Lista salva na sua rotina.');
      navigate('/app/minhas-listas');
    } else {
      toast('info', obj.msg || 'Essa lista já está na sua rotina.');
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
  const ids = Object.keys(agrupadas).filter((idLista) => {
    const meta = agrupadas[idLista][0];
    const nome = (meta.nome_lista || '').toLowerCase();
    const objetivo = meta.objetivo || '';
    if (filtroObjetivo && objetivo !== filtroObjetivo) {
      return false;
    }
    if (busca && !nome.includes(busca.toLowerCase()) && !objetivo.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    return true;
  });

  function contarObjetivo(valor) {
    return Object.keys(agrupadas).filter((idLista) => agrupadas[idLista][0].objetivo === valor).length;
  }

  return (
    <div>
      <div className="uf-card uf-toolbar-card">
        <div className="uf-toolbar">
          <div className="uf-search">
            <span className="material-symbols-outlined">search</span>
            <input className="uf-input" placeholder="Buscar rotina oficial ou grupamento muscular..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>
        <div className="uf-chips" style={{ marginTop: 12 }}>
          <button type="button" className={'uf-chip escuro' + (!filtroObjetivo ? ' ativo' : '')} onClick={() => setFiltroObjetivo('')}>
            Todos <span className="uf-chip-count">{Object.keys(agrupadas).length}</span>
          </button>
          {OBJETIVOS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={'uf-chip' + (filtroObjetivo === item.value ? ' ativo' : '')}
              onClick={() => setFiltroObjetivo(item.value)}
            >
              {item.label} <span className="uf-chip-count">{contarObjetivo(item.value)}</span>
            </button>
          ))}
        </div>
      </div>

      {ids.length === 0 ? (
        <p className="uf-empty uf-card">Nenhuma lista oficial no momento.</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {ids.map((idLista) => (
            <ListaCard
              key={idLista}
              lista={agrupadas[idLista]}
              oficial
              onExercicio={(exercicio) => setSelecionado(exercicio)}
              onSalvar={() => salvarOficial(agrupadas[idLista][0].id_lista)}
              onIniciar={() => iniciar(agrupadas[idLista][0].id_lista)}
            />
          ))}
        </div>
      )}
      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
