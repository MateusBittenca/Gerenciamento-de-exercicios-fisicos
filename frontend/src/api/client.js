export async function api(path, options = {}, auth = {}) {
  const { token, setToken } = auth;
  const url = path.startsWith('/') ? path : '/' + path;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  } else if (!headers.Authorization) {
    headers.Authorization = '';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (data.status === true && data.token && setToken) {
    setToken(data.token);
  }

  return data;
}

export function exerciseImageSrc(imagem) {
  if (!imagem) {
    return '';
  }
  return imagem.replace(/^\.\.\/ExerciciosGif\//, '/ExerciciosGif/');
}

export function groupListsById(items) {
  return items.reduce((acc, exercicio) => {
    if (exercicio.id_lista == null) {
      return acc;
    }
    if (!acc[exercicio.id_lista]) {
      acc[exercicio.id_lista] = [];
    }
    acc[exercicio.id_lista].push(exercicio);
    return acc;
  }, {});
}

export function exerciciosDaLista(lista) {
  return (lista || []).filter((item) => item.id_exercicio);
}

export function fichasParaModal(linhas) {
  const agrupadas = groupListsById(linhas || []);
  return Object.keys(agrupadas).map((id) => {
    const itens = agrupadas[id];
    const meta = itens[0];
    const exercicios = exerciciosDaLista(itens);
    return {
      id: meta.id_lista,
      nome: meta.nome_lista,
      tipo: meta.tipo_lista,
      objetivo: meta.objetivo,
      quantidade: exercicios.length,
      exercicios: exercicios.map((item) => item.id_exercicio)
    };
  });
}

export function listaContemExercicio(ficha, exercicioId) {
  return (ficha.exercicios || []).some((id) => String(id) === String(exercicioId));
}

export function escolhaInicialModal(fichas, exercicioId) {
  const livre = (fichas || []).find((ficha) => !listaContemExercicio(ficha, exercicioId));
  return livre ? livre.id : null;
}

export function formatPrescricao(item) {
  if (!item || !item.series) {
    return '';
  }
  const carga = item.carga_atual || item.carga_kg;
  const partes = [item.series + '×' + (item.reps || '10')];
  if (carga) {
    partes.push(carga + ' kg');
  }
  if (item.descanso_seg) {
    partes.push(item.descanso_seg + 's pausa');
  }
  return partes.join(' · ');
}

export const OBJETIVOS = [
  { value: 'hipertrofia', label: 'Hipertrofia' },
  { value: 'forca', label: 'Força' },
  { value: 'adaptacao', label: 'Adaptação' },
  { value: 'funcional', label: 'Funcional' }
];

export const OBJETIVO_USUARIO = [
  { value: 'hypertrophy', label: 'Hipertrofia & Definição Muscular' },
  { value: 'endurance', label: 'Resistência Cardiorrespiratória & Condicionamento' },
  { value: 'weight_loss', label: 'Emagrecimento & Saúde Metabólica' },
  { value: 'posture', label: 'Reabilitação Postural & Flexibilidade' },
  { value: 'strength', label: 'Força Pura & Performance Atlética' }
];

export const DIAS_UI = [
  { value: 1, label: 'S' },
  { value: 2, label: 'T' },
  { value: 3, label: 'Q' },
  { value: 4, label: 'Q' },
  { value: 5, label: 'S' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' }
];

export const PRESCRICAO_DEFAULT = {
  hipertrofia: { series: 3, reps: '8-12', descanso_seg: 90 },
  forca: { series: 4, reps: '4-6', descanso_seg: 150 },
  adaptacao: { series: 3, reps: '12-15', descanso_seg: 60 },
  funcional: { series: 3, reps: '10-12', descanso_seg: 60 }
};

export function defaultPrescricao(objetivo) {
  return PRESCRICAO_DEFAULT[objetivo] || { series: 3, reps: '10', descanso_seg: 60 };
}

export function parseDias(valor) {
  if (!valor) {
    return [];
  }
  return String(valor)
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));
}

export function formatDias(lista) {
  return (lista || []).join(',');
}

export function listaProgramadaHoje(lista) {
  const dias = parseDias(lista.dias_semana);
  if (dias.length === 0) {
    return false;
  }
  return dias.includes(new Date().getDay());
}

export function matriculaUf(id) {
  return '#UF-' + String(id || 0).padStart(5, '0');
}

export function calcularImc(peso, alturaMetros) {
  const p = parseFloat(peso);
  const a = parseFloat(alturaMetros);
  if (!p || !a || a <= 0) {
    return null;
  }
  return Number((p / (a * a)).toFixed(1));
}

export function classeDificuldade(valor) {
  const texto = String(valor || '').trim().toLowerCase();
  if (texto === 'iniciante') {
    return 'uf-diff-iniciante';
  }
  if (texto === 'intermediário' || texto === 'intermediario') {
    return 'uf-diff-intermediario';
  }
  if (texto === 'iniciante a intermediário' || texto === 'iniciante a intermediario') {
    return 'uf-diff-entre';
  }
  return '';
}

export function classificarImc(imc) {
  if (imc == null) {
    return { label: '—', tom: 'neutro' };
  }
  if (imc < 18.5) {
    return { label: 'Abaixo', tom: 'alerta' };
  }
  if (imc < 25) {
    return { label: 'Eutrofia', tom: 'ok' };
  }
  if (imc < 30) {
    return { label: 'Sobrepeso', tom: 'alerta' };
  }
  return { label: 'Obesidade', tom: 'risco' };
}

export function formatarMesAno(data) {
  if (!data) {
    return '—';
  }
  const dt = new Date(data);
  if (Number.isNaN(dt.getTime())) {
    return '—';
  }
  return dt.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

export function formatCronometro(segundos) {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return h + ':' + m + ':' + s;
}

export function segundosDesde(iso) {
  if (!iso) {
    return 0;
  }
  const inicio = new Date(iso).getTime();
  if (Number.isNaN(inicio)) {
    return 0;
  }
  return Math.max(0, Math.floor((Date.now() - inicio) / 1000));
}

export function idadeDe(data) {
  if (!data) {
    return null;
  }
  const dt = new Date(data);
  if (Number.isNaN(dt.getTime())) {
    return null;
  }
  const hoje = new Date();
  let idade = hoje.getFullYear() - dt.getFullYear();
  const m = hoje.getMonth() - dt.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dt.getDate())) {
    idade -= 1;
  }
  return idade;
}

export function alturaMetros(valor) {
  const n = parseFloat(String(valor || '').replace(',', '.'));
  if (!n) {
    return '';
  }
  return n > 3 ? Number((n / 100).toFixed(2)) : n;
}

export function alturaCm(metros) {
  const n = parseFloat(metros);
  if (!n) {
    return '';
  }
  return n > 3 ? Math.round(n) : Math.round(n * 100);
}

export function isoDate(valor) {
  if (!valor) {
    return '';
  }
  const dt = new Date(valor);
  if (Number.isNaN(dt.getTime())) {
    return String(valor).slice(0, 10);
  }
  return dt.toISOString().slice(0, 10);
}

export const MUSCULOS = ['Bíceps', 'Tríceps', 'Peito', 'Costas', 'Quadríceps', 'Ombro'];
