import api from './api';

// Buscar logs com filtros e paginação
export const getLogs = async (filters = {}, page = 1, limit = 100) => {
  const params = {
    page,
    limit,
    ...filters
  };
  
  const response = await api.get('/admin/logs', { params });
  return response.data;
};

// Exportar logs para CSV
export const exportLogs = async (filters = {}) => {
  const params = { ...filters };
  
  const response = await api.get('/admin/logs/export', {
    params,
    responseType: 'blob'
  });
  
  // Criar download do arquivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `logs_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return response.data;
};

export default {
  getLogs,
  exportLogs
};
