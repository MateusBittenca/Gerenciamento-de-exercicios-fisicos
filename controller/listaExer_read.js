const ListaExer = require("../model/lista_exercicios");
const JWT = require("../model/JWT");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_usuarioId = request.params.usuario_UsuarioID;
    if (entrada.aluno && String(p_usuarioId) !== String(entrada.usuarioId)) {
        jwt.negar(response, { motivo: 'papel' });
        return;
    }

    const listaExer = new ListaExer(banco);
    listaExer.usuario_UsuarioID = p_usuarioId;
    listaExer.read().then((respostaPromise) => {
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: respostaPromise,
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
