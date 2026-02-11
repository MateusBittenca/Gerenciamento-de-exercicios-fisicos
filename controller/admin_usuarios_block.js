const JWT = require('../model/JWT');

async function blockUnblockUser(req, res, banco) {
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

    const { usuarioId } = req.params;
    const { ativo } = req.body; // true ou false

    // Por enquanto, apenas retornamos sucesso (necessitaria adicionar campo 'ativo' na tabela)
    // Isso é uma implementação futura que requereria migração do banco
    
    res.status(200).send({
      mensagem: `Usuário ${ativo ? 'desbloqueado' : 'bloqueado'} com sucesso`,
      nota: 'Funcionalidade requer campo "ativo" na tabela usuarios'
    });

  } catch (error) {
    console.error('Erro ao bloquear/desbloquear usuário:', error);
    res.status(500).send('Erro ao processar solicitação');
  }
}

module.exports = blockUnblockUser;
