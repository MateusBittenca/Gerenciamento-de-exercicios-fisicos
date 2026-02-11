const getDashboardStats = require('../controller/stats_dashboard');
const getUsuariosStats = require('../controller/stats_usuarios');
const getExerciciosStats = require('../controller/stats_exercicios');
const { getLogs, exportLogs } = require('../controller/logs_read');
const blockUnblockUser = require('../controller/admin_usuarios_block');
const { bulkDeleteExercicios, bulkUpdateExercicios } = require('../controller/exercicios_bulk');

function rotasAdminPanel(app, banco) {
  // ===== ESTATÍSTICAS =====
  
  // Dashboard principal
  app.get('/admin/stats/dashboard', (req, res) => {
    getDashboardStats(req, res, banco);
  });

  // Estatísticas de usuários
  app.get('/admin/stats/usuarios', (req, res) => {
    getUsuariosStats(req, res, banco);
  });

  // Estatísticas de exercícios
  app.get('/admin/stats/exercicios', (req, res) => {
    getExerciciosStats(req, res, banco);
  });

  // ===== LOGS =====
  
  // Listar logs com filtros e paginação
  app.get('/admin/logs', (req, res) => {
    getLogs(req, res, banco);
  });

  // Exportar logs para CSV
  app.get('/admin/logs/export', (req, res) => {
    exportLogs(req, res, banco);
  });

  // ===== USUÁRIOS =====
  
  // Bloquear/Desbloquear usuário
  app.patch('/admin/usuarios/:usuarioId/status', (req, res) => {
    blockUnblockUser(req, res, banco);
  });

  // ===== EXERCÍCIOS =====
  
  // Deletar exercícios em massa
  app.post('/admin/exercicios/bulk-delete', (req, res) => {
    bulkDeleteExercicios(req, res, banco);
  });

  // Atualizar exercícios em massa
  app.post('/admin/exercicios/bulk-update', (req, res) => {
    bulkUpdateExercicios(req, res, banco);
  });
}

module.exports = rotasAdminPanel;
