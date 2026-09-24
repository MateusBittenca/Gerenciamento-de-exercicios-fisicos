const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const lista = new Lista(banco);
    lista.idLista = request.params.idLista;
    lista.readById().then((rows) => {
        const linha = rows && rows[0];
        if (!linha) {
            response.status(200).send({
                status: false,
                msg: 'Lista não encontrada.',
                codigo: '003',
                dados: {}
            });
            return;
        }
        if (!Lista.podeAlterar(linha, entrada)) {
            jwt.negar(response, { motivo: 'papel' });
            return;
        }
        return lista.delete().then(() => {
            response.status(200).send({
                status: true,
                msg: 'Deletado com sucesso!!',
                codigo: '002',
                dados: {},
                token: jwt.gerar(entrada.dados)
            });
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
