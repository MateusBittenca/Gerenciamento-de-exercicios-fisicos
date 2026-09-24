const Lista = require("../model/lista_exercicios.js");
const ListaDono = require("../model/lista");
const JWT = require("../model/JWT.js");

function exigirLista(banco, idLista, entrada) {
    const lista = new ListaDono(banco);
    lista.idLista = idLista;
    return lista.readById().then((rows) => {
        const linha = rows && rows[0];
        return { linha: linha, permitido: ListaDono.podeAlterar(linha, entrada) };
    });
}

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_idlista = request.params.idListaExer;
    exigirLista(banco, p_idlista, entrada).then((acesso) => {
        if (!acesso.linha) {
            response.status(200).send({
                status: false,
                msg: 'Lista não encontrada.',
                codigo: '003',
                dados: {}
            });
            return;
        }
        if (!acesso.permitido) {
            jwt.negar(response, { motivo: 'papel' });
            return;
        }
        const lista = new Lista(banco);
        lista.idListaExer = p_idlista;
        lista.idExercicios = request.params.idExercicios;
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
