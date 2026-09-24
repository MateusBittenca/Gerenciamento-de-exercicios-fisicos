const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_usuarioId = request.params.usuarioId;
    if (entrada.aluno && String(p_usuarioId) !== String(entrada.usuarioId)) {
        jwt.negar(response, { motivo: 'papel' });
        return;
    }

    const lista = new Lista(banco);
    lista.usuarioId = p_usuarioId;
    lista.read().then((respostaPromisse) => {
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: respostaPromisse,
            token: jwt.gerar(entrada.dados)
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro!!',
            codigo: '003',
            dados: {}
        });
    });
};
