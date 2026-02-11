const ActivityLog = require('../model/ActivityLog');

// Middleware para registrar atividades
function createLogger(banco) {
  const activityLog = new ActivityLog(banco);

  // Helper para extrair IP da requisição
  function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           'unknown';
  }

  // Helper para extrair informações do usuário do token
  function getUserFromToken(req) {
    try {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        return null;
      }

      const jwt = require('../model/JWT');
      const token = auth.substring(7);
      const payload = jwt.validar(token);
      
      if (!payload) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  // Middleware principal
  return {
    // Registrar login
    logLogin: (usuarioTipo, usuarioId, usuarioNome) => {
      return async (req, res, next) => {
        try {
          const ip = getClientIp(req);
          await activityLog.create(
            usuarioTipo,
            usuarioId,
            usuarioNome,
            'LOGIN',
            'Login realizado com sucesso',
            ip
          );
        } catch (error) {
          console.error('Erro ao registrar log de login:', error);
        }
        next();
      };
    },

    // Registrar logout
    logLogout: async (req, res, next) => {
      try {
        const user = getUserFromToken(req);
        if (user) {
          const ip = getClientIp(req);
          const usuarioTipo = user.AdministradorID ? 'admin' : 'usuario';
          const usuarioId = user.AdministradorID || user.UsuarioID;
          const usuarioNome = user.Nome;

          await activityLog.create(
            usuarioTipo,
            usuarioId,
            usuarioNome,
            'LOGOUT',
            'Logout realizado',
            ip
          );
        }
      } catch (error) {
        console.error('Erro ao registrar log de logout:', error);
      }
      next();
    },

    // Registrar criação
    logCreate: (tipo) => {
      return async (req, res, next) => {
        // Guardar a função send original
        const originalSend = res.send;
        
        res.send = async function(data) {
          try {
            const user = getUserFromToken(req);
            if (user && res.statusCode >= 200 && res.statusCode < 300) {
              const ip = getClientIp(req);
              const usuarioTipo = user.AdministradorID ? 'admin' : 'usuario';
              const usuarioId = user.AdministradorID || user.UsuarioID;
              const usuarioNome = user.Nome;

              let detalhes = `Criou ${tipo}`;
              if (req.body?.nome) {
                detalhes += `: ${req.body.nome}`;
              }

              await activityLog.create(
                usuarioTipo,
                usuarioId,
                usuarioNome,
                `CRIAR_${tipo.toUpperCase()}`,
                detalhes,
                ip
              );
            }
          } catch (error) {
            console.error('Erro ao registrar log de criação:', error);
          }
          
          originalSend.apply(res, arguments);
        };
        
        next();
      };
    },

    // Registrar atualização
    logUpdate: (tipo) => {
      return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = async function(data) {
          try {
            const user = getUserFromToken(req);
            if (user && res.statusCode >= 200 && res.statusCode < 300) {
              const ip = getClientIp(req);
              const usuarioTipo = user.AdministradorID ? 'admin' : 'usuario';
              const usuarioId = user.AdministradorID || user.UsuarioID;
              const usuarioNome = user.Nome;

              let detalhes = `Atualizou ${tipo}`;
              const id = req.params.usuarioId || req.params.adminID || req.params.idexercicio || req.params.idLista;
              if (id) {
                detalhes += ` ID: ${id}`;
              }

              await activityLog.create(
                usuarioTipo,
                usuarioId,
                usuarioNome,
                `ATUALIZAR_${tipo.toUpperCase()}`,
                detalhes,
                ip
              );
            }
          } catch (error) {
            console.error('Erro ao registrar log de atualização:', error);
          }
          
          originalSend.apply(res, arguments);
        };
        
        next();
      };
    },

    // Registrar exclusão
    logDelete: (tipo) => {
      return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = async function(data) {
          try {
            const user = getUserFromToken(req);
            if (user && res.statusCode >= 200 && res.statusCode < 300) {
              const ip = getClientIp(req);
              const usuarioTipo = user.AdministradorID ? 'admin' : 'usuario';
              const usuarioId = user.AdministradorID || user.UsuarioID;
              const usuarioNome = user.Nome;

              let detalhes = `Excluiu ${tipo}`;
              const id = req.params.usuarioId || req.params.adminID || req.params.idexercicio || req.params.idLista;
              if (id) {
                detalhes += ` ID: ${id}`;
              }

              await activityLog.create(
                usuarioTipo,
                usuarioId,
                usuarioNome,
                `EXCLUIR_${tipo.toUpperCase()}`,
                detalhes,
                ip
              );
            }
          } catch (error) {
            console.error('Erro ao registrar log de exclusão:', error);
          }
          
          originalSend.apply(res, arguments);
        };
        
        next();
      };
    },

    // Registrar ação customizada
    logAction: (acao, detalhes) => {
      return async (req, res, next) => {
        try {
          const user = getUserFromToken(req);
          if (user) {
            const ip = getClientIp(req);
            const usuarioTipo = user.AdministradorID ? 'admin' : 'usuario';
            const usuarioId = user.AdministradorID || user.UsuarioID;
            const usuarioNome = user.Nome;

            await activityLog.create(
              usuarioTipo,
              usuarioId,
              usuarioNome,
              acao,
              detalhes,
              ip
            );
          }
        } catch (error) {
          console.error('Erro ao registrar log de ação:', error);
        }
        next();
      };
    }
  };
}

module.exports = createLogger;
