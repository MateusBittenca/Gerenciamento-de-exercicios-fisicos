import api from './api';

export const userService = {
  async getUsuario(usuarioId) {
    try {
      const response = await api.get(`/usuario/${usuarioId}`);
      if (response.data.status && response.data.dados?.length > 0) {
        const row = response.data.dados[0];
        return {
          success: true,
          data: {
            usuarioId: row.UsuarioID,
            nome: row.Nome,
            email: row.Email,
            sexo: row.Sexo,
            altura: row.Altura,
            peso: row.Peso
          }
        };
      }
      return { success: false, data: null };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return { success: false, data: null };
    }
  },

  async updateUsuario(usuarioId, { nome, email, sexo, altura, peso }) {
    try {
      const response = await api.put(`/usuario/${usuarioId}`, {
        nome,
        email,
        sexo: sexo || null,
        altura: altura != null && altura !== '' ? Number(altura) : null,
        peso: peso != null && peso !== '' ? Number(peso) : null
      });
      if (response.data.status) {
        return {
          success: true,
          data: {
            usuarioId,
            nome: nome ?? response.data.dados?.nome,
            email: email ?? response.data.dados?.email,
            sexo: sexo ?? response.data.dados?.sexo,
            altura: altura ?? response.data.dados?.altura,
            peso: peso ?? response.data.dados?.peso
          }
        };
      }
      return { success: false, message: response.data.msg || 'Erro ao atualizar' };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, message: 'Erro ao atualizar perfil' };
    }
  }
};
