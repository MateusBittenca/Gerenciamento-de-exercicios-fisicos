const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if (validou.status == true) {

        const p_idlista = request.body.idlista || request.body.idLista || request.params.idlista;
        const p_nome = request.body.nome;
        const p_tipo = request.body.tipo;
        const p_objetivo = request.body.objetivo;
        const p_dias = request.body.dias_semana || request.body.diasSemana;

        const lista = new Lista(banco);

        lista.idLista = p_idlista;
        lista.nome = p_nome;
        lista.tipo = p_tipo;
        lista.objetivo = p_objetivo;
        lista.diasSemana = p_dias;

        lista.update().then(respostaPromise => {
            const resposta = {
                status: true,
                msg: 'atualizado com sucesso!!',
                codigo: '002',
                dados: {
                    idlista: p_idlista,
                    nome: p_nome,
                    tipo: p_tipo,
                    objetivo: p_objetivo,
                    dias_semana: p_dias
                },
                token:jwt.gerar(jwt.dados(validou))
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
