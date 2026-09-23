// conecta ao banco de dados MySQL e 
// lê o arquivo 001_treino_real.sql (fica na pasta database/migrations/). 
// executa todos os comandos do arquivo .sql automaticamente, 
// cria as tabelas necessárias (como usuários, exercícios, listas, etc.) 
// insere os dados iniciais do sistema.

const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'unifit'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);

    const sqlPath = path.join(__dirname, 'database', 'migrations', '001_treino_real.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const queries = sql.split(';').map(q => q.trim()).filter(q => q.length > 0);

    let currentIndex = 0;

    function runNextQuery() {
        if (currentIndex >= queries.length) {
            console.log('All migrations completed.');
            connection.end();
            return;
        }

        const query = queries[currentIndex];
        console.log(`Running query ${currentIndex + 1}/${queries.length}...`);
        connection.query(query, (error, results) => {
            if (error) {
                console.error(`Error in query ${currentIndex + 1}:`, error.message);
            } else {
                console.log(`Query ${currentIndex + 1} successful.`);
            }
            currentIndex++;
            runNextQuery();
        });
    }

    runNextQuery();
});
