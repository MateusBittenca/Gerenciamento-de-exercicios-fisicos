/**
 * ProgressChart — gráfico SVG puro para exibir a evolução de carga ao longo do tempo.
 * Não depende de nenhuma biblioteca externa de gráficos.
 *
 * Props:
 *   dados   – array de { carga_kg, concluida_em, reps_feitas, numero_serie }
 *   altura  – altura do SVG em px (padrão 240)
 */
export default function ProgressChart({ dados = [], altura = 240 }) {
  const PADDING = { top: 20, right: 24, bottom: 52, left: 52 };

  if (!dados || dados.length === 0) {
    return (
      <div className="uf-chart-empty">
        <span className="material-symbols-outlined">show_chart</span>
        <p>Nenhum dado registrado ainda.<br />Complete treinos para ver sua evolução.</p>
      </div>
    );
  }

  // Agrupa por sessão: pega a carga máxima por sessão/data
  const porSessao = {};
  dados.forEach((row) => {
    const chave = row.sessao_id + '_' + (row.concluida_em || '').slice(0, 10);
    if (!porSessao[chave]) {
      porSessao[chave] = { ...row, carga_kg: Number(row.carga_kg) };
    } else if (Number(row.carga_kg) > porSessao[chave].carga_kg) {
      porSessao[chave].carga_kg = Number(row.carga_kg);
    }
  });

  const pontos = Object.values(porSessao)
    .sort((a, b) => new Date(a.concluida_em) - new Date(b.concluida_em))
    .slice(-20); // máx 20 sessões

  if (pontos.length === 0) {
    return (
      <div className="uf-chart-empty">
        <span className="material-symbols-outlined">show_chart</span>
        <p>Nenhum dado registrado ainda.</p>
      </div>
    );
  }

  const cargas = pontos.map((p) => Number(p.carga_kg));
  const minCarga = Math.max(0, Math.min(...cargas) - 5);
  const maxCarga = Math.max(...cargas) + 5;
  const range = maxCarga - minCarga || 1;

  const W = 800;
  const H = altura;
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top - PADDING.bottom;

  const toX = (i) => PADDING.left + (i / Math.max(pontos.length - 1, 1)) * innerW;
  const toY = (v) => PADDING.top + innerH - ((v - minCarga) / range) * innerH;

  // Linha suavizada com curvas bezier
  const pathD = pontos.reduce((acc, p, i) => {
    const x = toX(i);
    const y = toY(p.carga_kg);
    if (i === 0) return `M ${x} ${y}`;
    const px = toX(i - 1);
    const py = toY(pontos[i - 1].carga_kg);
    const cp1x = px + (x - px) / 3;
    const cp1y = py;
    const cp2x = x - (x - px) / 3;
    const cp2y = y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
  }, '');

  // Área preenchida
  const areaD =
    pathD +
    ` L ${toX(pontos.length - 1)} ${H - PADDING.bottom}` +
    ` L ${toX(0)} ${H - PADDING.bottom} Z`;

  // Linhas de grade horizontais (4 divisões)
  const ticks = 4;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const val = minCarga + (range * i) / ticks;
    return { y: toY(val), label: val.toFixed(1) };
  });

  // Formatação de data curta
  const fmtData = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Qual ponto renderizar no eixo X (evita sobreposição)
  const step = Math.max(1, Math.ceil(pontos.length / 6));
  const xLabels = pontos
    .map((p, i) => ({ i, label: fmtData(p.concluida_em) }))
    .filter((_, i) => i % step === 0 || i === pontos.length - 1);

  const ultimaCarga = cargas[cargas.length - 1];
  const primeiraCarga = cargas[0];
  const delta = ultimaCarga - primeiraCarga;
  const deltaPercent = primeiraCarga !== 0 ? ((delta / primeiraCarga) * 100).toFixed(1) : 0;

  return (
    <div className="uf-chart-wrap">
      <div className="uf-chart-header">
        <div className="uf-chart-stat">
          <span>Última</span>
          <strong>{ultimaCarga} kg</strong>
        </div>
        <div className={`uf-chart-stat ${delta >= 0 ? 'positivo' : 'negativo'}`}>
          <span>Evolução</span>
          <strong>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)} kg
            <small> ({delta >= 0 ? '+' : ''}{deltaPercent}%)</small>
          </strong>
        </div>
        <div className="uf-chart-stat">
          <span>Sessões</span>
          <strong>{pontos.length}</strong>
        </div>
        <div className="uf-chart-stat">
          <span>Maior</span>
          <strong>{Math.max(...cargas)} kg</strong>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="uf-chart-svg"
        role="img"
        aria-label="Gráfico de evolução de carga"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c30505" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c30505" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grade horizontal */}
        {gridLines.map((gl, i) => (
          <g key={i}>
            <line
              x1={PADDING.left}
              y1={gl.y}
              x2={W - PADDING.right}
              y2={gl.y}
              stroke="#e6e8ea"
              strokeWidth="1"
              strokeDasharray={i === 0 ? 'none' : '4 4'}
            />
            <text
              x={PADDING.left - 8}
              y={gl.y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#5c5f63"
            >
              {Number(gl.label).toFixed(0)}
            </text>
          </g>
        ))}

        {/* Eixo X labels */}
        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={toX(i)}
            y={H - PADDING.bottom + 18}
            textAnchor="middle"
            fontSize="11"
            fill="#5c5f63"
          >
            {label}
          </text>
        ))}

        {/* Label eixo Y */}
        <text
          x={14}
          y={PADDING.top + innerH / 2}
          textAnchor="middle"
          fontSize="11"
          fill="#5c5f63"
          transform={`rotate(-90, 14, ${PADDING.top + innerH / 2})`}
        >
          kg
        </text>

        {/* Área preenchida */}
        <path d={areaD} fill="url(#chartGrad)" />

        {/* Linha principal */}
        <path
          d={pathD}
          fill="none"
          stroke="#c30505"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Pontos */}
        {pontos.map((p, i) => {
          const x = toX(i);
          const y = toY(p.carga_kg);
          const isLast = i === pontos.length - 1;
          return (
            <g key={i} className="uf-chart-point">
              <circle cx={x} cy={y} r={isLast ? 7 : 5} fill="#fff" stroke="#c30505" strokeWidth="2.5" />
              {isLast && (
                <>
                  <circle cx={x} cy={y} r={12} fill="#c30505" fillOpacity="0.12" />
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#c30505"
                  >
                    {p.carga_kg} kg
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
