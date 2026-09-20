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
    if (!acc[exercicio.id_lista]) {
      acc[exercicio.id_lista] = [];
    }
    acc[exercicio.id_lista].push(exercicio);
    return acc;
  }, {});
}

export const MUSCULOS = ['Bíceps', 'Tríceps', 'Peito', 'Costas', 'Quadríceps', 'Ombro'];

export const swalDark = {
  color: 'white',
  background: '#1f2021'
};
