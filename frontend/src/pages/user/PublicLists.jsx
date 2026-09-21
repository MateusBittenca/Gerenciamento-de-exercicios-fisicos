import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { groupListsById } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import ListaCard from '../../components/ListaCard';

export default function PublicLists() {
  const { request, refreshSessao } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

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

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Listas oficiais</h1>
          <p>Sugestões da academia. Salve na rotina ou treine direto.</p>
        </div>
      </div>

      {Object.keys(agrupadas).length === 0 ? (
        <p className="uf-empty uf-card">Nenhuma lista oficial no momento.</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => (
            <ListaCard
              key={idLista}
              lista={agrupadas[idLista]}
              onAbrir={() => setSelecionado(agrupadas[idLista].find((item) => item.id_exercicio) || null)}
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
