const exerfav = require('../controller/exerfav');

module.exports = function(app, banco) {
    app.post('/exerfav', (request, response) => {
        exerfav.create(request, response, banco);
    });
    app.get('/exerfav', (request, response) => {
        exerfav.read(request, response, banco);
    });
    app.delete('/exerfav/:exercicioId', (request, response) => {
        exerfav.delete(request, response, banco);
    });
};
