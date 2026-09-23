import { useState } from 'react';

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function WorkoutCalendar({ diasTreinados = [], onMesChange }) {
  const hoje = new Date();
  const [viewAno, setViewAno] = useState(hoje.getFullYear());
  const [viewMes, setViewMes] = useState(hoje.getMonth());

  const diasSet = new Set(diasTreinados);

  function navegar(delta) {
    let novoMes = viewMes + delta;
    let novoAno = viewAno;
    if (novoMes < 0) { novoMes = 11; novoAno -= 1; }
    if (novoMes > 11) { novoMes = 0; novoAno += 1; }
    setViewMes(novoMes);
    setViewAno(novoAno);
    onMesChange && onMesChange(novoAno, novoMes + 1);
  }

  const primeiroDia = new Date(viewAno, viewMes, 1);
  const ultimoDia = new Date(viewAno, viewMes + 1, 0);
  const totalDias = ultimoDia.getDate();
  const offsetInicio = (primeiroDia.getDay() + 6) % 7;

  const celulas = [];
  for (let i = 0; i < offsetInicio; i++) celulas.push(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);

  function fmtKey(d) {
    const mm = String(viewMes + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${viewAno}-${mm}-${dd}`;
  }

  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  const isHojeMesAtual = hoje.getFullYear() === viewAno && hoje.getMonth() === viewMes;

  const prefixoMes = `${viewAno}-${String(viewMes + 1).padStart(2, '0')}`;
  const diasTreinadosMesView = diasTreinados.filter(d => d.startsWith(prefixoMes)).length;

  const isUltimoMes = viewAno === hoje.getFullYear() && viewMes === hoje.getMonth();

  return (
    <div className="uf-cal">
      <div className="uf-cal-header">
        <button type="button" className="uf-cal-nav" onClick={() => navegar(-1)} aria-label="Mes anterior">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="uf-cal-title-block">
          <span className="uf-cal-mes">{MESES[viewMes]}</span>
          <span className="uf-cal-ano">{viewAno}</span>
        </div>
        <button type="button" className="uf-cal-nav" onClick={() => navegar(1)} aria-label="Proximo mes" disabled={isUltimoMes}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="uf-cal-grid uf-cal-weekdays">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="uf-cal-weekday">{d}</div>
        ))}
      </div>

      <div className="uf-cal-grid uf-cal-days">
        {celulas.map((dia, idx) => {
          if (dia === null) {
            return <div key={`empty-${idx}`} className="uf-cal-cell uf-cal-cell--vazio" />;
          }
          const key = fmtKey(dia);
          const treinado = diasSet.has(key);
          const ehHoje = isHojeMesAtual && key === hojeStr;
          let cls = 'uf-cal-cell';
          if (treinado) cls += ' uf-cal-cell--treino';
          if (ehHoje) cls += ' uf-cal-cell--hoje';
          return (
            <div key={key} className={cls} title={treinado ? 'Treino concluido' : ''}>
              <span className="uf-cal-num">{dia}</span>
              {treinado && <span className="uf-cal-dot" aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <div className="uf-cal-footer">
        <span className="uf-cal-legend">
          <span className="uf-cal-legend-dot" />
          Treino concluido
        </span>
        <span className="uf-cal-count">
          {diasTreinadosMesView === 0
            ? 'Nenhum treino este mes'
            : `${diasTreinadosMesView} dia${diasTreinadosMesView > 1 ? 's' : ''} treinado${diasTreinadosMesView > 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}

