const Usuario = require("../model/Usuario.js");
const JWT = require("../model/JWT.js");

function semSenha(linhas) {
    return (linhas || []).map((linha) => {
        const copia = Object.assign({}, linha);
        delete copia.Senha;
        return copia;
    });
}

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

    const usuario = new Usuario(banco);
    usuario.usuarioId = p_usuarioId;
    usuario.read().then((respostaPromise) => {
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: semSenha(respostaPromise),
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
