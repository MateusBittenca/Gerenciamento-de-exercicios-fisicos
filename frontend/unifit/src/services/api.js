import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: só atualiza token em respostas de login (evita sobrescrever com token de outras rotas)
api.interceptors.response.use(
  (response) => {
    const isLogin = response.config?.url?.includes('/login') || response.config?.url?.includes('/cadastrar');
    if (isLogin && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('payload');
      window.location.href = `${window.location.origin}/login`;
    }
    return Promise.reject(error);
  }
);

export default api;
