import api from './api';

export const exercicioService = {
  // Buscar todos os exercícios
  async getExercicios() {
    try {
      const response = await api.get('/exercicios');
      return { success: response.data.status, data: response.data.dados };
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      return { success: false, message: 'Erro ao buscar exercícios' };
    }
  },

  // Buscar exercício por ID
  async getExercicioPorId(id) {
    try {
      const response = await api.get(`/exercicios/${id}`);
      return { success: response.data.status, data: response.data.dados };
    } catch (error) {
      console.error('Erro ao buscar exercício:', error);
      return { success: false, message: 'Erro ao buscar exercício' };
    }
  },

  // Criar exercício (admin)
  async criarExercicio(exercicio) {
    try {
      const response = await api.post('/exercicios', exercicio);
      return { success: response.data.status, data: response.data };
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      return { success: false, message: 'Erro ao criar exercício' };
    }
  },

  // Atualizar exercício (admin)
  async atualizarExercicio(id, exercicio) {
    try {
      const response = await api.put(`/exercicios/${id}`, exercicio);
      return { success: response.data.status, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      return { success: false, message: 'Erro ao atualizar exercício' };
    }
  },

  // Deletar exercício (admin)
  async deletarExercicio(id) {
    try {
      const response = await api.delete(`/exercicios/${id}`);
      return { success: response.data.status, data: response.data };
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      return { success: false, message: 'Erro ao deletar exercício' };
    }
  }
};
