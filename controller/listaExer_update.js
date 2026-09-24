const ListaExer = require("../model/lista_exercicios");
const Lista = require("../model/lista");
const JWT = require("../model/JWT");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_id = request.body.id || request.body.id_lista_exercicio;
    if (!p_id) {
        response.status(200).send({ status: false, msg: 'Não pode ter valores nulos!!', codigo: '001', dados: {} });
        return;
    }

    const linha = new ListaExer(banco);
    linha.idLinha = p_id;
    linha.readListaIdDaLinha().then((rows) => {
        const vinculo = rows && rows[0];
        if (!vinculo) {
            response.status(200).send({ status: false, msg: 'Exercício não encontrado na lista.', codigo: '003', dados: {} });
            return;
        }
        const lista = new Lista(banco);
        lista.idLista = vinculo.lista_idlista;
        return lista.readById().then((listas) => {
            const dono = listas && listas[0];
            if (!Lista.podeAlterar(dono, entrada)) {
                jwt.negar(response, { motivo: 'papel' });
                return;
            }
            linha.ordem = request.body.ordem;
            linha.series = request.body.series;
            linha.reps = request.body.reps;
            linha.cargaKg = request.body.carga_kg != null ? request.body.carga_kg : request.body.cargaKg;
            linha.descansoSeg = request.body.descanso_seg || request.body.descansoSeg;
            linha.observacao = request.body.observacao;
            return linha.update().then(() => {
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
                    token: jwt.gerar(entrada.dados)
                });
            });
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao atualizar!!', codigo: '003', dados: {} });
    });
};
