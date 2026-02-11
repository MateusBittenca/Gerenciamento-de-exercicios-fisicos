class ActivityLog {
  constructor(banco) {
    this.banco = banco;
  }

  // Criar novo log de atividade
  async create(usuarioTipo, usuarioId, usuarioNome, acao, detalhes, ip) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO activity_logs (usuario_tipo, usuario_id, usuario_nome, acao, detalhes, ip)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      this.banco.query(sql, [usuarioTipo, usuarioId, usuarioNome, acao, detalhes, ip], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Listar todos os logs com paginação
  async read(limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM activity_logs
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      this.banco.query(sql, [limit, offset], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Buscar logs por intervalo de datas
  async readByDateRange(startDate, endDate, limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM activity_logs
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      this.banco.query(sql, [startDate, endDate, limit, offset], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Buscar logs por tipo de usuário
  async readByUserType(usuarioTipo, limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM activity_logs
        WHERE usuario_tipo = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      this.banco.query(sql, [usuarioTipo, limit, offset], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Buscar logs com filtros avançados
  async readWithFilters(filters = {}, limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM activity_logs WHERE 1=1`;
      const params = [];

      if (filters.usuarioTipo) {
        sql += ` AND usuario_tipo = ?`;
        params.push(filters.usuarioTipo);
      }

      if (filters.acao) {
        sql += ` AND acao LIKE ?`;
        params.push(`%${filters.acao}%`);
      }

      if (filters.usuarioNome) {
        sql += ` AND usuario_nome LIKE ?`;
        params.push(`%${filters.usuarioNome}%`);
      }

      if (filters.startDate && filters.endDate) {
        sql += ` AND created_at BETWEEN ? AND ?`;
        params.push(filters.startDate, filters.endDate);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      this.banco.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Contar total de logs com filtros
  async count(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT COUNT(*) as total FROM activity_logs WHERE 1=1`;
      const params = [];

      if (filters.usuarioTipo) {
        sql += ` AND usuario_tipo = ?`;
        params.push(filters.usuarioTipo);
      }

      if (filters.acao) {
        sql += ` AND acao LIKE ?`;
        params.push(`%${filters.acao}%`);
      }

      if (filters.usuarioNome) {
        sql += ` AND usuario_nome LIKE ?`;
        params.push(`%${filters.usuarioNome}%`);
      }

      if (filters.startDate && filters.endDate) {
        sql += ` AND created_at BETWEEN ? AND ?`;
        params.push(filters.startDate, filters.endDate);
      }

      this.banco.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].total);
        }
      });
    });
  }

  // Obter estatísticas por período
  async getStatsByPeriod(days = 30) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          DATE(created_at) as data,
          COUNT(*) as total,
          SUM(CASE WHEN usuario_tipo = 'usuario' THEN 1 ELSE 0 END) as total_usuarios,
          SUM(CASE WHEN usuario_tipo = 'admin' THEN 1 ELSE 0 END) as total_admins
        FROM activity_logs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY data DESC
      `;
      
      this.banco.query(sql, [days], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Obter ações mais frequentes
  async getTopActions(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          acao,
          COUNT(*) as total
        FROM activity_logs
        GROUP BY acao
        ORDER BY total DESC
        LIMIT ?
      `;
      
      this.banco.query(sql, [limit], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Obter logs recentes
  async getRecent(limit = 20) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM activity_logs
        ORDER BY created_at DESC
        LIMIT ?
      `;
      
      this.banco.query(sql, [limit], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = ActivityLog;
