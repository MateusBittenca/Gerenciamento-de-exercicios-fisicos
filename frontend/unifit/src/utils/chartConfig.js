import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Filler,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Filler,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
);

/** Paleta de cores para gráficos (tema Unifit) - tons de vermelho/coral */
export const CHART_COLORS = [
  '#dc2626',
  '#ef4444',
  '#f87171',
  '#fca5a5',
  '#fecaca',
  '#fef2f2',
];

/** Cores para gráficos de barra com gradiente (primária → mais clara) */
export const BAR_GRADIENT = ['#b91c1c', '#dc2626', '#ef4444'];

/** Animação padrão suave */
const defaultAnimation = {
  duration: 700,
};

/** Tooltip estilizado (tema escuro) */
const tooltipStyle = {
  backgroundColor: 'rgba(28, 28, 28, 0.96)',
  titleColor: '#fafafa',
  bodyColor: '#e5e5e5',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  borderWidth: 1,
  padding: 14,
  cornerRadius: 12,
  titleFont: { size: 13, weight: '600' },
  bodyFont: { size: 12 },
  boxPadding: 6,
  displayColors: true,
  usePointStyle: true,
  callbacks: {},
};

/** Legenda estilizada */
const legendStyle = {
  usePointStyle: true,
  pointStyle: 'circle',
  labels: {
    color: '#d4d4d4',
    font: { size: 12, weight: '500' },
    padding: 20,
    usePointStyle: true,
  },
};

/** Escalas com grid sutil e sem borda */
const scalesStyle = {
  x: {
    grid: {
      color: 'rgba(255, 255, 255, 0.05)',
      drawBorder: false,
    },
    ticks: {
      color: '#a3a3a3',
      maxRotation: 45,
      minRotation: 0,
      font: { size: 11 },
      padding: 10,
    },
    border: { display: false },
  },
  y: {
    grid: {
      color: 'rgba(255, 255, 255, 0.05)',
      drawBorder: false,
    },
    ticks: {
      color: '#a3a3a3',
      font: { size: 11 },
      padding: 10,
    },
    border: { display: false },
  },
};

/** Opções padrão para gráficos de barra/linha no tema escuro */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: defaultAnimation,
  layout: {
    padding: { top: 16, right: 20, bottom: 8, left: 8 },
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      ...legendStyle,
    },
    tooltip: {
      ...tooltipStyle,
    },
  },
  scales: scalesStyle,
  barPercentage: 0.72,
  categoryPercentage: 0.85,
};

/** Opções para gráficos de linha (com área preenchida e pontos destacados) */
export const lineChartOptions = {
  ...defaultChartOptions,
  elements: {
    line: {
      borderWidth: 2.5,
      tension: 0.4,
    },
    point: {
      radius: 4,
      hoverRadius: 7,
      hitRadius: 12,
    },
  },
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      ...defaultChartOptions.plugins.legend,
    },
  },
};

/** Opções para gráficos de pizza/rosca */
export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: defaultAnimation,
  layout: {
    padding: { top: 12, right: 12, bottom: 12, left: 12 },
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      ...legendStyle,
      labels: {
        ...legendStyle.labels,
        padding: 16,
      },
    },
    tooltip: {
      ...tooltipStyle,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const value = context.raw;
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return ` ${context.label}: ${value} (${percent}%)`;
        },
      },
    },
  },
};

/** Cria gradiente vertical para preenchimento de linha (usar em backgroundColor do dataset) */
export function createLineGradient(chart, color = '220, 38, 38') {
  const { ctx, chartArea } = chart;
  if (!chartArea) return `rgba(${color}, 0.2)`;
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, `rgba(${color}, 0)`);
  gradient.addColorStop(0.4, `rgba(${color}, 0.08)`);
  gradient.addColorStop(1, `rgba(${color}, 0.22)`);
  return gradient;
}

/** Cria gradiente para barras (esquerda → direita) */
export function createBarGradient(chart, colorStops = ['#b91c1c', '#dc2626', '#ef4444']) {
  const { ctx, chartArea } = chart;
  if (!chartArea) return colorStops[1];
  const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  colorStops.forEach((color, i) => gradient.addColorStop(i / (colorStops.length - 1), color));
  return gradient;
}
