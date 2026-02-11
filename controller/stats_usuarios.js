const JWT = require('../model/JWT');

async function getUsuariosStats(req, res, banco) {
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

    // Distribuição por sexo
    const distribuicaoPorSexo = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          Sexo,
          COUNT(*) as total
        FROM usuarios
        WHERE Sexo IS NOT NULL AND Sexo != ''
        GROUP BY Sexo
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Estatísticas de altura e peso
    const estatisticasCorpo = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          AVG(Altura) as altura_media,
          AVG(Peso) as peso_media,
          MIN(Altura) as altura_min,
          MAX(Altura) as altura_max,
          MIN(Peso) as peso_min,
          MAX(Peso) as peso_max,
          COUNT(CASE WHEN Altura IS NOT NULL AND Peso IS NOT NULL THEN 1 END) as total_com_dados
        FROM usuarios
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });

    // Calcular IMC médio
    const imcStats = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          AVG(Peso / (Altura * Altura)) as imc_medio,
          COUNT(CASE 
            WHEN (Peso / (Altura * Altura)) < 18.5 THEN 1 
          END) as abaixo_peso,
          COUNT(CASE 
            WHEN (Peso / (Altura * Altura)) BETWEEN 18.5 AND 24.9 THEN 1 
          END) as peso_normal,
          COUNT(CASE 
            WHEN (Peso / (Altura * Altura)) BETWEEN 25 AND 29.9 THEN 1 
          END) as sobrepeso,
          COUNT(CASE 
            WHEN (Peso / (Altura * Altura)) >= 30 THEN 1 
          END) as obesidade
        FROM usuarios
        WHERE Altura > 0 AND Peso > 0
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });

    // Total de listas criadas por usuários
    const listasStats = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          COUNT(DISTINCT usuario_UsuarioID) as usuarios_com_listas,
          COUNT(*) as total_listas_usuarios,
          AVG(listas_por_usuario) as media_listas
        FROM (
          SELECT 
            usuario_UsuarioID,
            COUNT(*) as listas_por_usuario
          FROM lista
          WHERE usuario_UsuarioID IS NOT NULL
          GROUP BY usuario_UsuarioID
        ) subquery
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });

    // Top 10 usuários com mais listas
    const topUsuarios = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          u.Nome,
          u.Email,
          COUNT(l.idlista) as total_listas
        FROM usuarios u
        LEFT JOIN lista l ON u.UsuarioID = l.usuario_UsuarioID
        GROUP BY u.UsuarioID, u.Nome, u.Email
        ORDER BY total_listas DESC
        LIMIT 10
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    res.status(200).json({
      distribuicaoPorSexo,
      estatisticasCorpo,
      imcStats,
      listasStats,
      topUsuarios
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de usuários:', error);
    res.status(500).send('Erro ao buscar estatísticas de usuários');
  }
}

module.exports = getUsuariosStats;
