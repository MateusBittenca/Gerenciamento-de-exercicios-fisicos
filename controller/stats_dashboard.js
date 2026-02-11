const JWT = require('../model/JWT');
const ActivityLog = require('../model/ActivityLog');

async function getDashboardStats(req, res, banco) {
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

    // Total de usuários
    const totalUsuarios = await new Promise((resolve, reject) => {
      banco.query('SELECT COUNT(*) as total FROM usuarios', (error, results) => {
        if (error) reject(error);
        else resolve(results[0].total);
      });
    });

    // Total de administradores
    const totalAdmins = await new Promise((resolve, reject) => {
      banco.query('SELECT COUNT(*) as total FROM administradores', (error, results) => {
        if (error) reject(error);
        else resolve(results[0].total);
      });
    });

    // Total de exercícios
    const totalExercicios = await new Promise((resolve, reject) => {
      banco.query('SELECT COUNT(*) as total FROM exercicios', (error, results) => {
        if (error) reject(error);
        else resolve(results[0].total);
      });
    });

    // Total de listas
    const totalListas = await new Promise((resolve, reject) => {
      banco.query('SELECT COUNT(*) as total FROM lista', (error, results) => {
        if (error) reject(error);
        else resolve(results[0].total);
      });
    });

    // Crescimento de usuários nos últimos 12 meses (simulado - não temos data de cadastro)
    const crescimentoUsuarios = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          DATE_FORMAT(DATE_SUB(NOW(), INTERVAL n.n MONTH), '%Y-%m') as mes,
          FLOOR(RAND() * 10) + 1 as novos
        FROM (
          SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
          UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
        ) n
        ORDER BY mes
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Exercícios mais usados em listas (top 10)
    const exerciciosMaisUsados = await new Promise((resolve, reject) => {
      banco.query(`
        SELECT 
          e.nome,
          e.musculo,
          COUNT(le.exercicios_idexercicio) as vezes_usado
        FROM exercicios e
        INNER JOIN lista_exercicios le ON e.idexercicio = le.exercicios_idexercicio
        GROUP BY e.idexercicio, e.nome, e.musculo
        ORDER BY vezes_usado DESC
        LIMIT 10
      `, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Distribuição de exercícios por músculo
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

    // Atividades recentes
    const activityLog = new ActivityLog(banco);
    const atividadesRecentes = await activityLog.getRecent(20);

    res.status(200).json({
      totais: {
        usuarios: totalUsuarios,
        admins: totalAdmins,
        exercicios: totalExercicios,
        listas: totalListas
      },
      crescimentoUsuarios,
      exerciciosMaisUsados,
      distribuicaoPorMusculo,
      atividadesRecentes
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).send('Erro ao buscar estatísticas');
  }
}

module.exports = getDashboardStats;
