const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if (validou.status == true) {

        const p_idlista = request.params.idlista;
        const p_nome = request.body.nome;
        const p_tipo = request.body.tipo;

        const lista = new Lista(banco);

        lista.idLista = p_idlista;
        lista.nome = p_nome;
        lista.tipo = p_tipo;

        lista.update().then(respostaPromise => {
            const resposta = {
                status: true,
                msg: 'atualizado com sucesso!!',
                codigo: '002',
                dados: {
                    idlista: p_idlista,
                    nome: p_nome,
                    tipo: p_tipo
                },
                token:jwt.gerar(validou.payload.payload)
            }
            response.status(200).send(resposta)
        }).catch(erro => {
            const resposta = {
                status: false,
                msg: 'erro ao atualizar!!',
                codigo: '003',
                dados: {}
            }
            response.status(200).send(resposta);
        })
    } else {
        const resposta = {
            status: false,
            msg: 'Token invalido!',
            codigo: '003',
            dados: {}
        };
        response.status(200).send(resposta);
    }
}
