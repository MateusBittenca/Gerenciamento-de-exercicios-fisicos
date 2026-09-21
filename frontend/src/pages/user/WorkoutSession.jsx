import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { formatCronometro, segundosDesde, swalDark } from '../../api/client';

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
        descanso: serie.descanso_seg || 60,
        repsPrescritas: serie.reps_prescritas,
        series: []
      });
    }
    grupos[indice[chave]].series.push({ ...serie });
  });
  return grupos;
}

export default function WorkoutSession() {
  const { sessaoId } = useParams();
  const { request, refreshSessao } = useAuth();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [agora, setAgora] = useState(Date.now());
  const [descansoAte, setDescansoAte] = useState(0);
  const [inicioLocal] = useState(Date.now());

  async function carregar() {
    const obj = await request('/treino/' + sessaoId, { method: 'get' });
    if (obj.status === true && obj.dados) {
      setSessao(obj.dados.sessao);
      setGrupos(agrupar(obj.dados.series));
    } else {
      Swal.fire({ ...swalDark, title: 'Erro!', text: obj.msg || 'Treino não encontrado.', icon: 'error' });
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
    return Math.round((todas.filter((s) => Number(s.concluida) === 1).length / todas.length) * 100);
  }, [grupos, agora]);

  function alterar(exercicioId, serieId, campo, valor) {
    setGrupos((atual) => atual.map((grupo) => {
      if (grupo.exercicioId !== exercicioId) {
        return grupo;
      }
      return {
        ...grupo,
        series: grupo.series.map((serie) => serie.id === serieId ? { ...serie, [campo]: valor } : serie)
      };
    }));
  }

  async function marcar(grupo, serie, concluida) {
    if (!emAndamento) {
      return;
    }
    const obj = await request('/treino/' + sessaoId + '/serie', {
      method: 'put',
      body: JSON.stringify({
        id: serie.id,
        carga_kg: serie.carga_kg || null,
        reps_feitas: serie.reps_feitas || null,
        concluida: concluida
      })
    });
    if (obj.status === true && obj.dados) {
      setSessao(obj.dados.sessao);
      setGrupos(agrupar(obj.dados.series));
      if (concluida) {
        setDescansoAte(Date.now() + (grupo.descanso || 60) * 1000);
      }
    }
  }

  async function encerrar(tipo) {
    const confirm = await Swal.fire({
      ...swalDark,
      title: tipo === 'concluir' ? 'Concluir treino?' : 'Cancelar treino?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Voltar'
    });
    if (!confirm.isConfirmed) {
      return;
    }
    const obj = await request('/treino/' + sessaoId + '/' + tipo, {
      method: 'put',
      body: JSON.stringify({ duracao_seg: decorrido })
    });
    if (obj.status === true) {
      await refreshSessao();
      Swal.fire({
        ...swalDark,
        title: tipo === 'concluir' ? 'Treino concluído!' : 'Treino cancelado.',
        icon: tipo === 'concluir' ? 'success' : 'info'
      });
      navigate('/app');
    } else {
      Swal.fire({ ...swalDark, title: 'Erro!', text: obj.msg || 'Não foi possível encerrar.', icon: 'error' });
    }
  }

  if (!sessao) {
    return <p className="uf-empty uf-card">Carregando treino…</p>;
  }

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <p className="uf-kicker">Sessão em andamento</p>
          <h1>{sessao.nome_lista}</h1>
          <p>{progresso}% das séries · {formatCronometro(decorrido)}</p>
        </div>
        <div className="uf-actions">
          <div className="uf-treino-timer">{formatCronometro(decorrido)}</div>
          {emAndamento && (
            <>
              <button type="button" className="uf-btn-ghost" onClick={() => encerrar('cancelar')}>Cancelar</button>
              <button type="button" className="uf-btn-primary" onClick={() => encerrar('concluir')}>Concluir treino</button>
            </>
          )}
        </div>
      </div>

      {grupos.map((grupo) => (
        <section className="uf-card uf-treino-ex" key={grupo.exercicioId}>
          <div className="uf-page-head" style={{ marginBottom: 12 }}>
            <div>
              <h2>{grupo.nome}</h2>
              <p className="uf-muted">{grupo.musculo} · pausa {grupo.descanso}s · {grupo.repsPrescritas || '10'} reps</p>
            </div>
          </div>
          <div className="uf-table-wrap">
            <table className="uf-table">
              <thead>
                <tr>
                  <th>Série</th>
                  <th>Carga (kg)</th>
                  <th>Reps</th>
                  <th>Feito</th>
                </tr>
              </thead>
              <tbody>
                {grupo.series.map((serie) => (
                  <tr key={serie.id}>
                    <td>{serie.numero_serie}</td>
                    <td>
                      <input
                        className="uf-input"
                        type="number"
                        step="0.5"
                        disabled={!emAndamento || Number(serie.concluida) === 1}
                        value={serie.carga_kg || ''}
                        onChange={(e) => alterar(grupo.exercicioId, serie.id, 'carga_kg', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="uf-input"
                        type="number"
                        disabled={!emAndamento || Number(serie.concluida) === 1}
                        value={serie.reps_feitas || ''}
                        placeholder={grupo.repsPrescritas || ''}
                        onChange={(e) => alterar(grupo.exercicioId, serie.id, 'reps_feitas', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={'uf-check' + (Number(serie.concluida) === 1 ? ' ativo' : '')}
                        disabled={!emAndamento}
                        onClick={() => marcar(grupo, serie, Number(serie.concluida) === 1 ? 0 : 1)}
                      >
                        <span className="material-symbols-outlined" style={Number(serie.concluida) === 1 ? { fontVariationSettings: "'FILL' 1" } : undefined}>check_circle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {descansoRestante > 0 && (
        <div className="uf-rest-pill">
          <span className="material-symbols-outlined">timer</span>
          Descanso {formatCronometro(descansoRestante)}
        </div>
      )}
    </div>
  );
}
