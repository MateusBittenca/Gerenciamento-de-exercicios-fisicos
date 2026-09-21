import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { groupListsById, listaProgramadaHoje } from '../../api/client';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';
import ListaCard from '../../components/ListaCard';

export default function Home() {
  const { payload, request, refreshSessao, sessaoAtiva } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [oficiais, setOficiais] = useState([]);
  const [minhas, setMinhas] = useState([]);
  const [favoritos, setFavoritos] = useState(0);
  const [treinosMes, setTreinosMes] = useState(0);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    async function carregar() {
      const listas = await request('/listas/read', { method: 'get' });
      if (listas.status === true) {
        setOficiais(listas.dados || []);
      }

      const minhasRes = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
      if (minhasRes.status === true) {
        setMinhas(minhasRes.dados || []);
      }

      const exer = await request('/exercicios', { method: 'get' });
      if (exer.status === true) {
        setExercicios(exer.dados || []);
      }

      const fav = await request('/exerfav', { method: 'get' });
      if (fav.status === true) {
        setFavoritos((fav.dados || []).length);
      }

      const resumo = await request('/treino/resumo', { method: 'get' });
      if (resumo.status === true) {
        setTreinosMes((resumo.dados && resumo.dados.concluidasMes) || 0);
      }
    }
    carregar();
  }, [payload.usuarioId, request]);

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

  const minhasAgrupadas = groupListsById(minhas);
  const oficiaisAgrupadas = groupListsById(oficiais);
  const sugestoes = exercicios.slice(0, 4);
  const idsMinhas = Object.keys(minhasAgrupadas);
  const sessao = sessaoAtiva && sessaoAtiva.sessao;

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <p className="uf-kicker">Portal do aluno</p>
          <h1>Olá, {payload?.nome}</h1>
          <p>Escolha uma lista e treine. O restante fica salvo no seu perfil.</p>
        </div>
      </div>

      {sessao && sessao.status === 'em_andamento' && (
        <button type="button" className="uf-banner" onClick={() => navigate('/app/treino/' + sessao.id)}>
          <span className="material-symbols-outlined">timer</span>
          <span><strong>Treino em andamento</strong> — {sessao.nome_lista || 'Continuar'}</span>
          <span className="uf-banner-go">Continuar</span>
        </button>
      )}

      <section className="uf-home-metrics">
        <article className="uf-card uf-metric">
          <span className="uf-muted">Treinos no mês</span>
          <strong>{treinosMes}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Minhas listas</span>
          <strong>{idsMinhas.length}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Favoritos</span>
          <strong>{favoritos}</strong>
        </article>
      </section>

      <section>
        <div className="uf-page-head">
          <h2>Minhas listas</h2>
        </div>
        {idsMinhas.length === 0 ? (
          <div className="uf-empty uf-card">
            <p>Crie uma lista ou salve uma oficial para começar.</p>
            <div className="uf-actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="uf-btn-primary" onClick={() => navigate('/app/minhas-listas')}>Criar lista</button>
              <button type="button" className="uf-btn-outline" onClick={() => navigate('/app/listas')}>Ver oficiais</button>
            </div>
          </div>
        ) : (
          <div className="uf-grid-lists">
            {idsMinhas.map((idLista) => (
              <ListaCard
                key={idLista}
                lista={minhasAgrupadas[idLista]}
                destaqueHoje={listaProgramadaHoje(minhasAgrupadas[idLista][0])}
                onIniciar={() => iniciar(minhasAgrupadas[idLista][0].id_lista)}
              />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="uf-page-head">
          <h2>Oficiais para salvar</h2>
        </div>
        {Object.keys(oficiaisAgrupadas).length === 0 ? (
          <p className="uf-empty uf-card">Nenhuma lista oficial.</p>
        ) : (
          <div className="uf-grid-lists">
            {Object.keys(oficiaisAgrupadas).slice(0, 3).map((idLista) => (
              <ListaCard
                key={idLista}
                lista={oficiaisAgrupadas[idLista]}
                onSalvar={() => salvarOficial(oficiaisAgrupadas[idLista][0].id_lista)}
                onIniciar={() => iniciar(oficiaisAgrupadas[idLista][0].id_lista)}
              />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="uf-page-head">
          <h2>Do catálogo</h2>
        </div>
        <div className="uf-grid-cards">
          {sugestoes.length === 0 ? (
            <p className="uf-empty uf-card">Nenhum exercício no catálogo.</p>
          ) : sugestoes.map((exercicio) => (
            <ExerciseCard
              key={exercicio.idexercicio}
              exercicio={exercicio}
              compact
              onOpen={() => setSelecionado(exercicio)}
            />
          ))}
        </div>
      </section>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
