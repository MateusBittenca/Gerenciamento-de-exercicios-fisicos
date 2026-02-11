const JWT = require('../model/JWT');
const ActivityLog = require('../model/ActivityLog');

async function getLogs(req, res, banco) {
  try {
    // Verificar autenticação admin
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).send('Token não fornecido');
    }

    const jwt = new JWT();
    const validacao = jwt.validar(auth);
    
    if (!validacao.status) {
      return res.status(403).send('Token inválido');
    }
    
    const userData = validacao.payload?.payload;
    if (!userData?.AdministradorID) {
      return res.status(403).send('Acesso negado - não é admin');
    }

    const activityLog = new ActivityLog(banco);
    
    // Parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // Filtros
    const filters = {};
    if (req.query.usuarioTipo) {
      filters.usuarioTipo = req.query.usuarioTipo;
    }
    if (req.query.acao) {
      filters.acao = req.query.acao;
    }
    if (req.query.usuarioNome) {
      filters.usuarioNome = req.query.usuarioNome;
    }
    if (req.query.startDate && req.query.endDate) {
      filters.startDate = req.query.startDate;
      filters.endDate = req.query.endDate;
    }

    // Buscar logs com filtros
    const logs = await activityLog.readWithFilters(filters, limit, offset);
    const total = await activityLog.count(filters);

    res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).send('Erro ao buscar logs');
  }
}

async function exportLogs(req, res, banco) {
  try {
    // Verificar autenticação admin
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).send('Token não fornecido');
    }

    const jwt = new JWT();
    const validacao = jwt.validar(auth);
    
    if (!validacao.status) {
      return res.status(403).send('Token inválido');
    }
    
    const userData = validacao.payload?.payload;
    if (!userData?.AdministradorID) {
      return res.status(403).send('Acesso negado - não é admin');
    }

    const activityLog = new ActivityLog(banco);
    
    // Filtros
    const filters = {};
    if (req.query.usuarioTipo) {
      filters.usuarioTipo = req.query.usuarioTipo;
    }
    if (req.query.acao) {
      filters.acao = req.query.acao;
    }
    if (req.query.usuarioNome) {
      filters.usuarioNome = req.query.usuarioNome;
    }
    if (req.query.startDate && req.query.endDate) {
      filters.startDate = req.query.startDate;
      filters.endDate = req.query.endDate;
    }

    // Buscar todos os logs que correspondem aos filtros (sem limite)
    const logs = await activityLog.readWithFilters(filters, 10000, 0);

    // Converter para CSV
    const csvHeader = 'ID,Data/Hora,Tipo Usuario,ID Usuario,Nome Usuario,Acao,Detalhes,IP\n';
    const csvRows = logs.map(log => {
      const data = new Date(log.created_at).toLocaleString('pt-BR');
      return `${log.id},"${data}","${log.usuario_tipo}",${log.usuario_id},"${log.usuario_nome}","${log.acao}","${log.detalhes || ''}","${log.ip}"`;
    }).join('\n');
    
    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=logs.csv');
    res.status(200).send('\uFEFF' + csv); // BOM para UTF-8

  } catch (error) {
    console.error('Erro ao exportar logs:', error);
    res.status(500).send('Erro ao exportar logs');
  }
}

module.exports = { getLogs, exportLogs };
