const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

function semSenha(linhas) {
    return (linhas || []).map((linha) => {
        const copia = Object.assign({}, linha);
        delete copia.Senha;
        return copia;
    });
}

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'admin');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const admin = new Admin(banco);
    admin.adminID = request.params.adminID;
    admin.read().then((respostaPromisse) => {
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: semSenha(respostaPromisse),
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
