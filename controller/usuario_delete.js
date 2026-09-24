const Usuario = require("../model/Usuario");
const JWT = require("../model/JWT");

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'admin');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const usuario = new Usuario(banco);
    usuario.usuarioId = request.params.usuarioId;

    usuario.delete().then(() => {
        response.status(200).send({
            status: true,
            msg: 'Deletado com sucesso!!',
            codigo: '002',
            dados: {},
            token: jwt.gerar(entrada.dados)
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro ao deletar!!',
            codigo: '003',
            dados: {}
        });
    });
};
