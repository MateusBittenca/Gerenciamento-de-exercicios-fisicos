const JWT = require('../model/JWT');
const Exercicios = require('../model/Exercicios');

async function bulkDeleteExercicios(req, res, banco) {
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

    const { ids } = req.body; // Array de IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send('IDs inválidos');
    }

    const exercicios = new Exercicios(banco);
    let deletados = 0;

    // Deletar cada exercício
    for (const id of ids) {
      try {
        await exercicios.delete(id);
        deletados++;
      } catch (error) {
        console.error(`Erro ao deletar exercício ${id}:`, error);
      }
    }

    res.status(200).json({
      mensagem: `${deletados} exercício(s) deletado(s) com sucesso`,
      total: ids.length,
      sucesso: deletados
    });

  } catch (error) {
    console.error('Erro ao deletar exercícios em massa:', error);
    res.status(500).send('Erro ao deletar exercícios');
  }
}

async function bulkUpdateExercicios(req, res, banco) {
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

    const { ids, updates } = req.body; // Array de IDs e objeto com campos a atualizar

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send('IDs inválidos');
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).send('Dados de atualização inválidos');
    }

    // Construir query de atualização
    const fields = [];
    const values = [];

    if (updates.dificuldade) {
      fields.push('dificuldade = ?');
      values.push(updates.dificuldade);
    }
    if (updates.tipo) {
      fields.push('tipo = ?');
      values.push(updates.tipo);
    }

    if (fields.length === 0) {
      return res.status(400).send('Nenhum campo para atualizar');
    }

    const placeholders = ids.map(() => '?').join(',');
    values.push(...ids);

    const sql = `
      UPDATE exercicios 
      SET ${fields.join(', ')}
      WHERE idexercicio IN (${placeholders})
    `;

    await new Promise((resolve, reject) => {
      banco.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    res.status(200).json({
      mensagem: 'Exercícios atualizados com sucesso',
      total: ids.length
    });

  } catch (error) {
    console.error('Erro ao atualizar exercícios em massa:', error);
    res.status(500).send('Erro ao atualizar exercícios');
  }
}

module.exports = { bulkDeleteExercicios, bulkUpdateExercicios };
