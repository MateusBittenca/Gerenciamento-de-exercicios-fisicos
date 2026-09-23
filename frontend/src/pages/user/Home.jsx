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
  const primeiro = (payload?.nome || 'aluno').split(' ')[0];

  return (
    <div>
      <section className="uf-hello">
        <div>
          <p className="uf-kicker"><i />Portal do aluno</p>
          <h1>Olá, {primeiro} 👋</h1>
          <p>Bora treinar hoje? Confira seus treinos organizados e os exercícios do catálogo da academia.</p>
        </div>
        <div className="uf-kpi-row">
          <article className="uf-card uf-kpi">
            <div className="uf-kpi-top">
              Treinos
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--uf-primary)' }}>check_circle</span>
            </div>
            <strong>{treinosMes} <small>/ mês</small></strong>
          </article>
          <article className="uf-card uf-kpi">
            <div className="uf-kpi-top">
              Listas
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--uf-secondary)' }}>format_list_bulleted</span>
            </div>
            <strong>{idsMinhas.length} <small>ativas</small></strong>
          </article>
          <article className="uf-card uf-kpi">
            <div className="uf-kpi-top">
              Favoritos
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--uf-primary)', fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>
            <strong>{favoritos} <small>itens</small></strong>
          </article>
        </div>
      </section>

      {sessao && sessao.status === 'em_andamento' && (
        <button type="button" className="uf-banner" onClick={() => navigate('/app/treino/' + sessao.id)}>
          <span className="material-symbols-outlined">timer</span>
          <span><strong>Treino em andamento</strong> — {sessao.nome_lista || 'Continuar'}</span>
          <span className="uf-banner-go">Continuar</span>
        </button>
      )}

      <section>
        <div className="uf-section-head">
          <h2>
            <span className="material-symbols-outlined" style={{ color: 'var(--uf-primary)' }}>view_timeline</span>
            Minhas listas em destaque
          </h2>
          <button type="button" className="uf-section-link" onClick={() => navigate('/app/minhas-listas')}>
            Ver todas as listas
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="uf-grid-lists">
          {idsMinhas.map((idLista) => (
            <ListaCard
              key={idLista}
              lista={minhasAgrupadas[idLista]}
              destaqueHoje={listaProgramadaHoje(minhasAgrupadas[idLista][0])}
              onIniciar={() => iniciar(minhasAgrupadas[idLista][0].id_lista)}
              onAbrir={() => navigate('/app/minhas-listas')}
            />
          ))}
          <button type="button" className="uf-card uf-list-create" onClick={() => navigate('/app/minhas-listas')}>
            <div className="uf-list-create-icon">
              <span className="material-symbols-outlined">add</span>
            </div>
            <strong>Criar nova lista</strong>
            <span>Monte uma rotina personalizada ou organize seus exercícios favoritos.</span>
          </button>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <div className="uf-section-head">
          <h2>
            <span className="material-symbols-outlined" style={{ color: 'var(--uf-secondary)' }}>verified</span>
            Listas oficiais UniFit
          </h2>
          <button type="button" className="uf-section-link" onClick={() => navigate('/app/listas')}>
            Explorar catálogo oficial
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        {Object.keys(oficiaisAgrupadas).length === 0 ? (
          <p className="uf-empty uf-card">Nenhuma lista oficial.</p>
        ) : (
          <div className="uf-grid-lists">
            {Object.keys(oficiaisAgrupadas).slice(0, 3).map((idLista) => (
              <ListaCard
                key={idLista}
                lista={oficiaisAgrupadas[idLista]}
                oficial
                onSalvar={() => salvarOficial(oficiaisAgrupadas[idLista][0].id_lista)}
                onIniciar={() => iniciar(oficiaisAgrupadas[idLista][0].id_lista)}
              />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <div className="uf-section-head">
          <h2>
            <span className="material-symbols-outlined" style={{ color: 'var(--uf-primary)' }}>fitness_center</span>
            Do catálogo
          </h2>
          <button type="button" className="uf-section-link" onClick={() => navigate('/app/exercicios')}>
            Ver catálogo
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
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
