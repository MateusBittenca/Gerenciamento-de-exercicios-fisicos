const treino = require('../controller/treino');

module.exports = function(app, banco) {
    app.post('/treino/iniciar', (request, response) => {
        treino.iniciar(request, response, banco);
    });
    app.get('/treino/ativa', (request, response) => {
        treino.ativa(request, response, banco);
    });
    app.get('/treino/resumo', (request, response) => {
        treino.resumo(request, response, banco);
    });
    app.get('/treino/historico/carga/:idExercicio', (request, response) => {
        treino.historicoCarga(request, response, banco);
    });
    app.get('/treino/:id', (request, response) => {
        treino.read(request, response, banco);
    });
    app.put('/treino/:id/serie', (request, response) => {
        treino.serie(request, response, banco);
    });
    app.put('/treino/:id/concluir', (request, response) => {
        treino.concluir(request, response, banco);
    });
    app.put('/treino/:id/cancelar', (request, response) => {
        treino.cancelar(request, response, banco);
    });
};
