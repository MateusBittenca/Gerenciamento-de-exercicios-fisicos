import api from './api';

export const listaService = {
  // Buscar todas as listas recomendadas
  async getListasRecomendadas() {
    try {
      const response = await api.get('/lista');
      return { success: response.data.status, data: response.data.dados };
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
      return { success: false, message: 'Erro ao buscar listas' };
    }
  },

  // Buscar listas do usuário
  async getListasUsuario(usuarioId) {
    try {
      const response = await api.get(`/lista/${usuarioId}`);
      return { success: response.data.status, data: response.data.dados };
    } catch (error) {
      console.error('Erro ao buscar listas do usuário:', error);
      return { success: false, message: 'Erro ao buscar listas do usuário' };
    }
  },

  // Criar lista
  async criarLista(lista) {
    try {
      const response = await api.post('/lista/create', lista);
      return { success: response.data.status, data: response.data, message: response.data.msg };
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      return { success: false, message: error.response?.data?.msg || 'Erro ao criar lista' };
    }
  },

  // Adicionar exercício à lista
  async adicionarExercicioLista(idListaExer, idExercicios) {
    try {
      const response = await api.post('/lista/exercicios/create', {
        idListaExer,
        idExercicios
      });
      return { success: response.data.status, data: response.data, message: response.data.msg };
    } catch (error) {
      console.error('Erro ao adicionar exercício à lista:', error);
      return { success: false, message: error.response?.data?.msg || 'Erro ao adicionar exercício à lista' };
    }
  },

  // Buscar exercícios de uma lista específica
  async getExerciciosLista(idLista) {
    try {
      const response = await api.get(`/lista/${idLista}/exercicios`);
      return { success: response.data.status, data: response.data.dados };
    } catch (error) {
      console.error('Erro ao buscar exercícios da lista:', error);
      return { success: false, message: 'Erro ao buscar exercícios da lista' };
    }
  },

  // Remover exercício da lista
  async removerExercicioLista(idLista, idExercicio) {
    try {
      const response = await api.delete(`/lista/exercicios/delete/${idLista}/${idExercicio}`);
      return { success: response.data.status, data: response.data, message: response.data.msg };
    } catch (error) {
      console.error('Erro ao remover exercício da lista:', error);
      return { success: false, message: error.response?.data?.msg || 'Erro ao remover exercício da lista' };
    }
  },

  // Deletar lista
  async deletarLista(idLista) {
    try {
      const response = await api.delete(`/lista/delete/${idLista}`);
      return { success: response.data.status, data: response.data };
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
      return { success: false, message: 'Erro ao deletar lista' };
    }
  }
};
