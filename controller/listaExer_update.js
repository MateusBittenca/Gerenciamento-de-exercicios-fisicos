const ListaExer = require("../model/lista_exercicios");
const JWT = require("../model/JWT");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if (validou.status != true) {
        response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
        return;
    }

    const p_id = request.body.id || request.body.id_lista_exercicio;
    if (!p_id) {
        response.status(200).send({ status: false, msg: 'Não pode ter valores nulos!!', codigo: '001', dados: {} });
        return;
    }

    const linha = new ListaExer(banco);
    linha.idLinha = p_id;
    linha.ordem = request.body.ordem;
    linha.series = request.body.series;
    linha.reps = request.body.reps;
    linha.cargaKg = request.body.carga_kg != null ? request.body.carga_kg : request.body.cargaKg;
    linha.descansoSeg = request.body.descanso_seg || request.body.descansoSeg;
    linha.observacao = request.body.observacao;

    linha.update().then(() => {
        response.status(200).send({
            status: true,
            msg: 'atualizado com sucesso!!',
            codigo: '002',
            dados: {
                id: p_id,
                series: linha.series,
                reps: linha.reps,
                carga_kg: linha.cargaKg,
                descanso_seg: linha.descansoSeg
            },
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao atualizar!!', codigo: '003', dados: {} });
    });
};
