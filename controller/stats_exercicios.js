const JWT = require('../model/JWT');

async function getExerciciosStats(req, res, banco) {
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

    // Distribuição por músculo
    const distribuicaoPorMusculo = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          musculo,
          COUNT(*) as total
        FROM exercicios
        WHERE musculo IS NOT NULL AND musculo != ''
        GROUP BY musculo
        ORDER BY total DESC
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Distribuição por equipamento
    const distribuicaoPorEquipamento = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          equipamento,
          COUNT(*) as total
        FROM exercicios
        WHERE equipamento IS NOT NULL AND equipamento != ''
        GROUP BY equipamento
        ORDER BY total DESC
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Distribuição por dificuldade
    const distribuicaoPorDificuldade = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          dificuldade,
          COUNT(*) as total
        FROM exercicios
        WHERE dificuldade IS NOT NULL AND dificuldade != ''
        GROUP BY dificuldade
        ORDER BY 
          CASE 
            WHEN dificuldade = 'Iniciante' THEN 1
            WHEN dificuldade = 'Intermediário' THEN 2
            WHEN dificuldade = 'Avançado' THEN 3
            ELSE 4
          END
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Distribuição por tipo
    const distribuicaoPorTipo = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          tipo,
          COUNT(*) as total
        FROM exercicios
        WHERE tipo IS NOT NULL AND tipo != ''
        GROUP BY tipo
        ORDER BY total DESC
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Taxa de utilização (exercícios usados vs não usados)
    const taxaUtilizacao = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          COUNT(DISTINCT e.idexercicio) as total_exercicios,
          COUNT(DISTINCT le.exercicios_idexercicio) as exercicios_usados,
          (COUNT(DISTINCT e.idexercicio) - COUNT(DISTINCT le.exercicios_idexercicio)) as exercicios_nao_usados
        FROM exercicios e
        LEFT JOIN lista_exercicios le ON e.idexercicio = le.exercicios_idexercicio
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });

    // Exercícios mais populares (mais usados em listas)
    const exerciciosPopulares = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          e.nome,
          e.musculo,
          e.dificuldade,
          COUNT(le.exercicios_idexercicio) as vezes_usado
        FROM exercicios e
        INNER JOIN lista_exercicios le ON e.idexercicio = le.exercicios_idexercicio
        GROUP BY e.idexercicio, e.nome, e.musculo, e.dificuldade
        ORDER BY vezes_usado DESC
        LIMIT 15
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Exercícios nunca usados
    const exerciciosNaoUsados = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          e.nome,
          e.musculo,
          e.dificuldade,
          e.tipo
        FROM exercicios e
        LEFT JOIN lista_exercicios le ON e.idexercicio = le.exercicios_idexercicio
        WHERE le.exercicios_idexercicio IS NULL
        ORDER BY e.nome
        LIMIT 20
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    res.status(200).json({
      distribuicaoPorMusculo,
      distribuicaoPorEquipamento,
      distribuicaoPorDificuldade,
      distribuicaoPorTipo,
      taxaUtilizacao,
      exerciciosPopulares,
      exerciciosNaoUsados
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de exercícios:', error);
    res.status(500).send('Erro ao buscar estatísticas de exercícios');
  }
}

module.exports = getExerciciosStats;
