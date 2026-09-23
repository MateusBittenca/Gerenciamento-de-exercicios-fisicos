import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../auth/AuthContext';
import ProgressChart from '../../components/ProgressChart';
import WorkoutCalendar from '../../components/WorkoutCalendar';

export default function Dashboard() {
  const { request } = useAuth();
  const [exercicios, setExercicios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregandoHist, setCarregandoHist] = useState(false);
  const [resumo, setResumo] = useState({ concluidasMes: 0, totalTreinos: 0 });
  const [diasTreinados, setDiasTreinados] = useState([]);
  const [busca, setBusca] = useState('');

  // Carrega lista de exercícios e resumo do mês
  useEffect(() => {
    async function carregar() {
      const [exerRes, resumoRes] = await Promise.all([
        request('/exercicios', { method: 'get' }),
        request('/treino/resumo', { method: 'get' })
      ]);
      if (exerRes.status === true) {
        setExercicios(exerRes.dados || []);
      }
      if (resumoRes.status === true && resumoRes.dados) {
        setResumo({
          concluidasMes: resumoRes.dados.concluidasMes || 0,
          totalTreinos: resumoRes.dados.totalTreinos || 0
        });
        setDiasTreinados(resumoRes.dados.diasTreinados || []);
      }
    }
    carregar();
  }, [request]);

  // Busca histórico de carga do exercício selecionado
  const carregarHistorico = useCallback(
    async (exercicioId) => {
      setCarregandoHist(true);
      setHistorico([]);
      const res = await request('/treino/historico/carga/' + exercicioId, { method: 'get' });
      if (res.status === true) {
        // A API retorna do mais recente para o mais antigo; inverte para o gráfico
        setHistorico((res.dados || []).slice().reverse());
      }
      setCarregandoHist(false);
    },
    [request]
  );

  // Carrega dias treinados de outro mês quando o usuário navega no calendário
  const carregarDiasMes = useCallback(
    async (ano, mes) => {
      const res = await request(`/treino/resumo?ano=${ano}&mes=${mes}`, { method: 'get' });
      if (res.status === true && res.dados) {
        setDiasTreinados(res.dados.diasTreinados || []);
      }
    },
    [request]
  );

  function selecionarExercicio(ex) {
    setSelecionado(ex);
    setBusca('');
    carregarHistorico(ex.idexercicio);
  }

  // Estatísticas derivadas do histórico
  const cargas = historico.map((h) => Number(h.carga_kg));
  const maxCarga = cargas.length ? Math.max(...cargas) : null;
  const mediaCargas = cargas.length
    ? (cargas.reduce((a, b) => a + b, 0) / cargas.length).toFixed(1)
    : null;
  const primeiraData = historico[0]?.concluida_em;
  const ultimaData = historico[historico.length - 1]?.concluida_em;

  const fmtData = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Filtragem de exercícios pela busca
  const textoBusca = busca.toLowerCase();
  const exerciciosFiltrados = textoBusca
    ? exercicios.filter(
        (e) =>
          e.nome.toLowerCase().includes(textoBusca) ||
          (e.musculo || '').toLowerCase().includes(textoBusca)
      )
    : exercicios;

  // Agrupar exercícios por músculo para o painel lateral
  const porMusculo = exerciciosFiltrados.reduce((acc, ex) => {
    const m = ex.musculo || 'Outros';
    if (!acc[m]) acc[m] = [];
    acc[m].push(ex);
    return acc;
  }, {});

  return (
    <div className="uf-dashboard">
      {/* Cabeçalho */}
      <div className="uf-page-head">
        <div>
          <p className="uf-kicker">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bar_chart</span>
            Analytics
          </p>
          <h1>Dashboard de Progresso</h1>
          <p>Acompanhe a evolução da sua carga em cada exercício ao longo do tempo.</p>
        </div>
      </div>

      {/* Métricas do mês */}
      <section className="uf-dashboard-metrics">
        <article className="uf-card uf-metric">
          <span className="uf-muted">Treinos no mês</span>
          <strong>{resumo.concluidasMes}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Total de treinos</span>
          <strong>{resumo.totalTreinos}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Exercícios rastreados</span>
          <strong>{exercicios.length}</strong>
        </article>
        {selecionado && cargas.length > 0 ? (
          <>
            <article className="uf-card uf-metric uf-metric--highlight">
              <span className="uf-muted">Recorde — {selecionado.nome}</span>
              <strong>{maxCarga} <small>kg</small></strong>
            </article>
            <article className="uf-card uf-metric">
              <span className="uf-muted">Média de carga</span>
              <strong>{mediaCargas} <small>kg</small></strong>
            </article>
          </>
        ) : (
          <article className="uf-card uf-metric uf-metric--placeholder" style={{ gridColumn: 'span 2' }}>
            <span className="uf-muted">Selecione um exercício para ver métricas</span>
            <strong style={{ fontSize: 20, color: 'var(--uf-text-2)' }}>—</strong>
          </article>
        )}
      </section>

      {/* Calendário de treinos */}
      <section className="uf-dashboard-calendar-wrap">
        <div className="uf-card uf-dashboard-cal-card">
          <div className="uf-dashboard-cal-head">
            <p className="uf-kicker">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>
              Calendário
            </p>
            <h2>Dias treinados</h2>
            <p className="uf-muted">Navegue pelos meses para ver sua frequência de treinos.</p>
          </div>
          <WorkoutCalendar
            diasTreinados={diasTreinados}
            onMesChange={carregarDiasMes}
          />
        </div>
      </section>

      {/* Layout principal: sidebar + gráfico */}
      <div className="uf-dashboard-body">
        {/* Painel lateral de seleção de exercício */}
        <aside className="uf-dashboard-aside uf-card">
          <div className="uf-dashboard-aside-head">
            <h2>Exercícios</h2>
            <div className="uf-search" style={{ width: '100%' }}>
              <span className="material-symbols-outlined">search</span>
              <input
                id="dashboard-busca"
                type="text"
                className="uf-input"
                placeholder="Buscar exercício..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="uf-dashboard-ex-list">
            {Object.keys(porMusculo).length === 0 ? (
              <p className="uf-muted" style={{ padding: '16px' }}>Nenhum exercício encontrado.</p>
            ) : (
              Object.entries(porMusculo).map(([musculo, exs]) => (
                <div key={musculo} className="uf-dashboard-muscle-group">
                  <span className="uf-dashboard-muscle-label">{musculo}</span>
                  {exs.map((ex) => (
                    <button
                      key={ex.idexercicio}
                      id={`ex-btn-${ex.idexercicio}`}
                      type="button"
                      className={
                        'uf-dashboard-ex-btn' +
                        (selecionado?.idexercicio === ex.idexercicio ? ' ativo' : '')
                      }
                      onClick={() => selecionarExercicio(ex)}
                    >
                      <span className="material-symbols-outlined">fitness_center</span>
                      {ex.nome}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Área do gráfico */}
        <section className="uf-dashboard-chart-area">
          {!selecionado ? (
            <div className="uf-card uf-dashboard-empty-chart">
              <span className="material-symbols-outlined">show_chart</span>
              <h3>Selecione um exercício</h3>
              <p>Escolha um exercício na lista ao lado para visualizar sua progressão de carga.</p>
            </div>
          ) : (
            <div className="uf-card uf-dashboard-chart-card">
              <div className="uf-dashboard-chart-head">
                <div>
                  <h2>{selecionado.nome}</h2>
                  <p className="uf-muted">
                    {selecionado.musculo}
                    {cargas.length > 0 && (
                      <>
                        {' · '}
                        {fmtData(primeiraData)} → {fmtData(ultimaData)}
                      </>
                    )}
                  </p>
                </div>
                <span className="uf-badge" style={{ alignSelf: 'flex-start' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {selecionado.equipamento || 'fitness_center'}
                  </span>
                  {selecionado.equipamento || 'Livre'}
                </span>
              </div>

              {carregandoHist ? (
                <div className="uf-chart-loading">
                  <div className="uf-spinner" />
                  <p>Carregando histórico...</p>
                </div>
              ) : (
                <ProgressChart dados={historico} altura={280} />
              )}

              {/* Tabela de histórico recente */}
              {historico.length > 0 && (
                <div className="uf-dashboard-hist-table">
                  <h3 style={{ marginBottom: 12 }}>Histórico de sessões</h3>
                  <div className="uf-table-wrap">
                    <table className="uf-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Carga (kg)</th>
                          <th>Reps</th>
                          <th>Evolução</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...historico].reverse().map((row, i, arr) => {
                          const prev = arr[i + 1];
                          const diff = prev ? Number(row.carga_kg) - Number(prev.carga_kg) : null;
                          return (
                            <tr key={i}>
                              <td>{fmtData(row.concluida_em)}</td>
                              <td>
                                <strong>{row.carga_kg} kg</strong>
                              </td>
                              <td>{row.reps_feitas ?? '—'}</td>
                              <td>
                                {diff === null ? (
                                  <span className="uf-muted">—</span>
                                ) : diff > 0 ? (
                                  <span className="uf-badge ok">
                                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_upward</span>
                                    +{diff.toFixed(1)} kg
                                  </span>
                                ) : diff < 0 ? (
                                  <span className="uf-badge risco">
                                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_downward</span>
                                    {diff.toFixed(1)} kg
                                  </span>
                                ) : (
                                  <span className="uf-badge">= igual</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
