const ExerciciosFav = require("../model/ExerciciosFav");
const JWT = require("../model/JWT");

function recusar(response) {
    response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
}

module.exports.create = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const fav = new ExerciciosFav(banco);
    fav.usuarioId = dados.usuarioId;
    fav.exercicioId = request.body.exercicioId || request.body.idexercicio;
    fav.create().then(() => {
        response.status(200).send({ status: true, msg: 'Adicionado aos favoritos!', codigo: '002', dados: { exercicioId: fav.exercicioId }, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao favoritar!!', codigo: '003', dados: {} });
    });
};

module.exports.read = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const fav = new ExerciciosFav(banco);
    fav.usuarioId = dados.usuarioId;
    fav.read().then((rows) => {
        response.status(200).send({ status: true, msg: 'sucesso!!', codigo: '002', dados: rows, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};

module.exports.delete = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const fav = new ExerciciosFav(banco);
    fav.usuarioId = dados.usuarioId;
    fav.exercicioId = request.params.exercicioId;
    fav.delete().then(() => {
        response.status(200).send({ status: true, msg: 'Removido dos favoritos com sucesso!!', codigo: '002', dados: {}, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao remover dos favoritos!!', codigo: '003', dados: {} });
    });
};
