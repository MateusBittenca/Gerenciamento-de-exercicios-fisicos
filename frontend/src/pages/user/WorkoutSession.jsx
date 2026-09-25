import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import { exerciseImageSrc, formatCronometro, segundosDesde } from '../../api/client';

function agrupar(series) {
  const grupos = [];
  const indice = {};
  (series || []).forEach((serie) => {
    const chave = serie.exercicio_id;
    if (indice[chave] == null) {
      indice[chave] = grupos.length;
      grupos.push({
        exercicioId: chave,
        nome: serie.nome_exercicio,
        musculo: serie.musculo,
        equipamento: serie.equipamento,
        imagem: serie.imagem,
        instrucao: serie.instrucao,
        descanso: serie.descanso_seg || 60,
        repsPrescritas: serie.reps_prescritas,
        series: []
      });
    }
    grupos[indice[chave]].series.push({ ...serie });
  });
  return grupos;
}

function feita(serie) {
  return Number(serie.concluida) === 1;
}

function primeiroIncompleto(grupos) {
  for (let i = 0; i < grupos.length; i += 1) {
    const j = grupos[i].series.findIndex((serie) => !feita(serie));
    if (j >= 0) {
      return { exercicio: i, serie: j };
    }
  }
  return { exercicio: 0, serie: 0 };
}

function seguinte(grupos, exercicio, serie) {
  const grupo = grupos[exercicio];
  if (grupo) {
    for (let j = serie + 1; j < grupo.series.length; j += 1) {
      if (!feita(grupo.series[j])) {
        return { exercicio, serie: j };
      }
    }
  }
  for (let i = exercicio + 1; i < grupos.length; i += 1) {
    const j = grupos[i].series.findIndex((item) => !feita(item));
    if (j >= 0) {
      return { exercicio: i, serie: j };
    }
  }
  const aberto = primeiroIncompleto(grupos);
  const todas = grupos.every((item) => item.series.every(feita));
  if (todas) {
    return { exercicio, serie };
  }
  return aberto;
}

function numero(valor) {
  if (valor === '' || valor == null) {
    return '';
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : '';
}

export default function WorkoutSession() {
  const { sessaoId } = useParams();
  const { request, refreshSessao } = useAuth();
  const { toast, confirmar } = useFeedback();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [agora, setAgora] = useState(Date.now());
  const [descansoAte, setDescansoAte] = useState(0);
  const [inicioLocal] = useState(Date.now());
  const [foco, setFoco] = useState({ exercicio: 0, serie: 0 });
  const [salvando, setSalvando] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const posicionado = useRef(false);

  async function carregar() {
    const obj = await request('/treino/' + sessaoId, { method: 'get' });
    if (obj.status === true && obj.dados) {
      const lista = agrupar(obj.dados.series);
      setSessao(obj.dados.sessao);
      setGrupos(lista);
      if (!posicionado.current) {
        posicionado.current = true;
        setFoco(primeiroIncompleto(lista));
      }
    } else {
      toast('erro', obj.msg || 'Treino não encontrado.');
      navigate('/app');
    }
  }

  useEffect(() => {
    carregar();
  }, [sessaoId, request]);

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const emAndamento = sessao && sessao.status === 'em_andamento';
  const decorrido = emAndamento
    ? Math.max(segundosDesde(sessao.iniciada_em), Math.floor((agora - inicioLocal) / 1000))
    : (sessao && sessao.duracao_seg) || 0;
  const descansoRestante = Math.max(0, Math.ceil((descansoAte - agora) / 1000));

  const progresso = useMemo(() => {
    const todas = grupos.flatMap((g) => g.series);
    if (todas.length === 0) {
      return 0;
    }
    return Math.round((todas.filter(feita).length / todas.length) * 100);
  }, [grupos]);

  const indiceEx = grupos.length ? Math.min(foco.exercicio, grupos.length - 1) : 0;
  const grupo = grupos[indiceEx] || null;
  const indiceSerie = grupo ? Math.min(foco.serie, grupo.series.length - 1) : 0;
  const serie = grupo ? grupo.series[indiceSerie] : null;
  const tudoFeito = grupos.length > 0 && progresso === 100;

  function alterar(exercicioId, serieId, campo, valor) {
    setGrupos((atual) => atual.map((item) => {
      if (item.exercicioId !== exercicioId) {
        return item;
      }
      return {
        ...item,
        series: item.series.map((linha) => linha.id === serieId ? { ...linha, [campo]: valor } : linha)
      };
    }));
  }

  function ajustar(campo, delta) {
    if (!serie || !emAndamento || feita(serie)) {
      return;
    }
    const base = numero(serie[campo]);
    const prox = Math.max(0, Math.round(((base === '' ? 0 : base) + delta) * 10) / 10);
    alterar(grupo.exercicioId, serie.id, campo, prox);
  }

  function abrirExercicio(i) {
    const alvo = grupos[i];
    if (!alvo) {
      return;
    }
    const j = alvo.series.findIndex((item) => !feita(item));
    setAjuda(false);
    setFoco({ exercicio: i, serie: j >= 0 ? j : 0 });
  }

  async function marcar(concluida) {
    if (!emAndamento || !serie || salvando) {
      return;
    }
    setSalvando(true);
    const obj = await request('/treino/' + sessaoId + '/serie', {
      method: 'put',
      body: JSON.stringify({
        id: serie.id,
        carga_kg: numero(serie.carga_kg) === '' ? null : numero(serie.carga_kg),
        reps_feitas: numero(serie.reps_feitas) === '' ? null : numero(serie.reps_feitas),
        concluida: concluida
      })
    });
    setSalvando(false);
    if (obj.status === true && obj.dados) {
      const lista = agrupar(obj.dados.series);
      setSessao(obj.dados.sessao);
      setGrupos(lista);
      if (concluida) {
        setDescansoAte(Date.now() + (grupo.descanso || 60) * 1000);
        setFoco(seguinte(lista, indiceEx, indiceSerie));
        setAjuda(false);
      }
    } else {
      toast('erro', obj.msg || 'Não foi possível marcar a série.');
    }
  }

  async function encerrar(tipo) {
    const ok = await confirmar({
      titulo: tipo === 'concluir' ? 'Encerrar treino?' : 'Cancelar este treino?',
      texto: tipo === 'concluir' ? 'As séries marcadas ficam no histórico.' : 'A sessão será descartada.',
      confirma: tipo === 'concluir' ? 'Concluir' : 'Cancelar treino',
      perigo: tipo !== 'concluir'
    });
    if (!ok) {
      return;
    }
    const obj = await request('/treino/' + sessaoId + '/' + tipo, {
      method: 'put',
      body: JSON.stringify({ duracao_seg: decorrido })
    });
    if (obj.status === true) {
      await refreshSessao();
      toast(tipo === 'concluir' ? 'ok' : 'info', tipo === 'concluir' ? 'Treino concluído.' : 'Treino cancelado.');
      navigate('/app');
    } else {
      toast('erro', obj.msg || 'Não foi possível encerrar.');
    }
  }

  if (!sessao) {
    return (
      <div className="uf-sessao">
        <p className="uf-sessao-loading">Carregando treino…</p>
      </div>
    );
  }

  return (
    <div className="uf-sessao">
      <header className="uf-sessao-top">
        <button type="button" className="uf-sessao-icon" onClick={() => navigate('/app')} aria-label="Voltar">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="uf-sessao-titulo">
          <strong>{sessao.nome_lista}</strong>
          <span>{emAndamento ? 'Sessão em andamento' : 'Treino encerrado'}</span>
        </div>
        <div className="uf-sessao-relogio" aria-label="Tempo de sessão">{formatCronometro(decorrido)}</div>
      </header>

      <div className="uf-sessao-barra" aria-hidden="true">
        <i style={{ width: progresso + '%' }} />
      </div>

      {grupo && serie ? (
        <div className="uf-sessao-corpo">
          <div className="uf-sessao-passo">
            <button type="button" className="uf-sessao-icon" disabled={indiceEx === 0} onClick={() => abrirExercicio(indiceEx - 1)} aria-label="Exercício anterior">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span>Exercício {indiceEx + 1} de {grupos.length}</span>
            <button type="button" className="uf-sessao-icon" disabled={indiceEx >= grupos.length - 1} onClick={() => abrirExercicio(indiceEx + 1)} aria-label="Próximo exercício">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="uf-sessao-dots" role="tablist" aria-label="Exercícios">
            {grupos.map((item, i) => {
              const ok = item.series.every(feita);
              const cls = 'uf-sessao-dot' + (i === indiceEx ? ' atual' : '') + (ok ? ' ok' : '');
              return (
                <button key={item.exercicioId} type="button" className={cls} onClick={() => abrirExercicio(i)} aria-label={item.nome} aria-current={i === indiceEx ? 'true' : undefined}>
                  {ok ? <span className="material-symbols-outlined">check</span> : i + 1}
                </button>
              );
            })}
          </div>

          <section className="uf-sessao-palco" key={grupo.exercicioId}>
            <div className="uf-sessao-media">
              {grupo.imagem ? (
                <img src={exerciseImageSrc(grupo.imagem)} alt="" />
              ) : (
                <span className="material-symbols-outlined">fitness_center</span>
              )}
            </div>
            <div className="uf-sessao-meta">
              {grupo.musculo ? <span>{grupo.musculo}</span> : null}
              {grupo.equipamento ? <span>{grupo.equipamento}</span> : null}
            </div>
            <h1>{grupo.nome}</h1>
            <p>Pausa {grupo.descanso}s{grupo.repsPrescritas ? ' · meta ' + grupo.repsPrescritas + ' reps' : ''}</p>
            {grupo.instrucao ? (
              <button type="button" className="uf-sessao-ajuda" onClick={() => setAjuda((v) => !v)} aria-expanded={ajuda}>
                Como fazer
                <span className="material-symbols-outlined">{ajuda ? 'expand_less' : 'expand_more'}</span>
              </button>
            ) : null}
            {ajuda && grupo.instrucao ? <p className="uf-sessao-instr">{grupo.instrucao}</p> : null}
          </section>

          <div className="uf-sessao-series" role="tablist" aria-label="Séries">
            {grupo.series.map((item, i) => {
              const cls = 'uf-sessao-serie' + (i === indiceSerie ? ' atual' : '') + (feita(item) ? ' ok' : '');
              return (
                <button key={item.id} type="button" className={cls} onClick={() => setFoco({ exercicio: indiceEx, serie: i })}>
                  {feita(item) ? <span className="material-symbols-outlined">check</span> : null}
                  Série {item.numero_serie}
                </button>
              );
            })}
          </div>

          <div className="uf-sessao-steps">
            <div className="uf-sessao-step">
              <small>Carga</small>
              <div>
                <button type="button" onClick={() => ajustar('carga_kg', -2.5)} disabled={!emAndamento || feita(serie)} aria-label="Diminuir carga">−</button>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  disabled={!emAndamento || feita(serie)}
                  value={serie.carga_kg === null || serie.carga_kg === undefined ? '' : serie.carga_kg}
                  placeholder="0"
                  onChange={(e) => alterar(grupo.exercicioId, serie.id, 'carga_kg', e.target.value)}
                  aria-label="Carga em quilos"
                />
                <em>kg</em>
                <button type="button" onClick={() => ajustar('carga_kg', 2.5)} disabled={!emAndamento || feita(serie)} aria-label="Aumentar carga">+</button>
              </div>
            </div>
            <div className="uf-sessao-step">
              <small>Repetições</small>
              <div>
                <button type="button" onClick={() => ajustar('reps_feitas', -1)} disabled={!emAndamento || feita(serie)} aria-label="Diminuir repetições">−</button>
                <input
                  type="number"
                  step="1"
                  min="0"
                  disabled={!emAndamento || feita(serie)}
                  value={serie.reps_feitas === null || serie.reps_feitas === undefined ? '' : serie.reps_feitas}
                  placeholder={grupo.repsPrescritas || '0'}
                  onChange={(e) => alterar(grupo.exercicioId, serie.id, 'reps_feitas', e.target.value)}
                  aria-label="Repetições"
                />
                <button type="button" onClick={() => ajustar('reps_feitas', 1)} disabled={!emAndamento || feita(serie)} aria-label="Aumentar repetições">+</button>
              </div>
            </div>
          </div>

          <div className="uf-sessao-acao">
            {descansoRestante > 0 ? (
              <div className="uf-sessao-rest">
                <span className="material-symbols-outlined">timer</span>
                <div>
                  <small>Descanso</small>
                  <strong>{formatCronometro(descansoRestante)}</strong>
                </div>
                <button type="button" onClick={() => setDescansoAte(0)}>Pular</button>
              </div>
            ) : !feita(serie) ? (
              <button type="button" className="uf-sessao-go" disabled={!emAndamento || salvando} onClick={() => marcar(1)}>
                <span className="material-symbols-outlined">check</span>
                Marcar série
              </button>
            ) : tudoFeito && emAndamento ? (
              <button type="button" className="uf-sessao-go" onClick={() => encerrar('concluir')}>
                <span className="material-symbols-outlined">emoji_events</span>
                Concluir treino
              </button>
            ) : (
              <button type="button" className="uf-sessao-undo" disabled={!emAndamento || salvando} onClick={() => marcar(0)}>
                Desfazer série
              </button>
            )}
            {emAndamento && tudoFeito && feita(serie) && descansoRestante === 0 ? (
              <button type="button" className="uf-sessao-cancel" disabled={salvando} onClick={() => marcar(0)}>Desfazer esta série</button>
            ) : null}
            {emAndamento ? (
              <button type="button" className="uf-sessao-cancel" onClick={() => encerrar('cancelar')}>Cancelar treino</button>
            ) : (
              <button type="button" className="uf-sessao-cancel" onClick={() => navigate('/app')}>Voltar ao início</button>
            )}
          </div>
        </div>
      ) : (
        <p className="uf-sessao-loading">Esta sessão não tem séries.</p>
      )}
    </div>
  );
}
