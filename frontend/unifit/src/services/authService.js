import api from './api';

export const authService = {
  // Login de usuário
  async login(email, senha) {
    try {
      const response = await api.post('/usuario/login', { email, senha });
      if (response.data.status) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('payload', JSON.stringify(response.data.dados));
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Email ou senha incorretas!' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  },

  // Login de administrador
  async loginAdmin(email, senha) {
    try {
      const response = await api.post('/admin/login', { email, senha });
      if (response.data.status) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('payload', JSON.stringify(response.data.dados));
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Email ou senha incorretas!' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  },

  // Cadastro de usuário
  async cadastrar(nome, email, senha) {
    try {
      const response = await api.post('/usuario/cadastrar', { nome, email, senha });
      return { success: response.data.status, data: response.data };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, message: 'Erro ao cadastrar usuário' };
    }
  },

  // Verificar se existe sessão
  verificarSessao() {
    const token = localStorage.getItem('token');
    const payload = localStorage.getItem('payload');
    
    if (!token || !payload) {
      return null;
    }
    
    try {
      return JSON.parse(payload);
    } catch (error) {
      console.error('Erro ao parsear payload:', error);
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('payload');
  }
};
