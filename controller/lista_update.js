const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_idlista = request.body.idlista || request.body.idLista || request.params.idlista;
    const p_nome = request.body.nome;
    const p_tipo = request.body.tipo;
    const p_objetivo = request.body.objetivo;
    const p_dias = request.body.dias_semana || request.body.diasSemana;

    const lista = new Lista(banco);
    lista.idLista = p_idlista;
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

        lista.nome = p_nome;
        lista.tipo = p_tipo;
        lista.objetivo = p_objetivo;
        lista.diasSemana = p_dias;

        return lista.update().then(() => {
            response.status(200).send({
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
                token: jwt.gerar(entrada.dados)
            });
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro ao atualizar!!',
            codigo: '003',
            dados: {}
        });
    });
};
