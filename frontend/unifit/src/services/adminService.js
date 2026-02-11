import api from './api';

// Estatísticas do Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats/dashboard');
  return response.data;
};

// Estatísticas de Usuários
export const getUsersStats = async () => {
  const response = await api.get('/admin/stats/usuarios');
  return response.data;
};

// Estatísticas de Exercícios
export const getExerciciosStats = async () => {
  const response = await api.get('/admin/stats/exercicios');
  return response.data;
};

// Bloquear/Desbloquear Usuário
export const blockUser = async (usuarioId) => {
  const response = await api.patch(`/admin/usuarios/${usuarioId}/status`, { ativo: false });
  return response.data;
};

export const unblockUser = async (usuarioId) => {
  const response = await api.patch(`/admin/usuarios/${usuarioId}/status`, { ativo: true });
  return response.data;
};

// Bulk Delete Exercícios
export const bulkDeleteExercicios = async (ids) => {
  const response = await api.post('/admin/exercicios/bulk-delete', { ids });
  return response.data;
};

// Bulk Update Exercícios
export const bulkUpdateExercicios = async (ids, updates) => {
  const response = await api.post('/admin/exercicios/bulk-update', { ids, updates });
  return response.data;
};

export default {
  getDashboardStats,
  getUsersStats,
  getExerciciosStats,
  blockUser,
  unblockUser,
  bulkDeleteExercicios,
  bulkUpdateExercicios
};
