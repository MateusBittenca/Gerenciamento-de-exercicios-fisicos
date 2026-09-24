const ListaExer = require("../model/lista_exercicios");
const Lista = require("../model/lista");
const JWT = require("../model/JWT");
const prescricao = require("../model/prescricao");

module.exports = function (request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_idLista = request.body.idListaExer;
    const p_idExercicio = request.body.idExercicios;

    if (p_idLista == '' || p_idExercicio == '' || p_idLista == null || p_idExercicio == null) {
        response.status(200).send({
            status: false,
            msg: 'Não pode ter valores nulos!!',
            codigo: '001',
            dados: {}
        });
        return;
    }

    const lista = new Lista(banco);
    lista.idLista = p_idLista;
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

        const objetivo = linha.objetivo || 'hipertrofia';
        const def = prescricao.paraObjetivo(objetivo);
        const item = new ListaExer(banco);
        item.idListaExer = p_idLista;
        const ordemInformada = request.body.ordem;
        const definirOrdem = ordemInformada ? Promise.resolve(ordemInformada) : item.proximaOrdem();

        return definirOrdem.then((ordem) => {
            item.idExercicios = p_idExercicio;
            item.ordem = ordem;
            item.series = request.body.series || def.series;
            item.reps = request.body.reps || def.reps;
            item.cargaKg = request.body.carga_kg != null ? request.body.carga_kg : (request.body.cargaKg != null ? request.body.cargaKg : null);
            item.descansoSeg = request.body.descanso_seg || request.body.descansoSeg || def.descanso_seg;
            item.observacao = request.body.observacao || null;
            return item.create().then((respostaPromise) => {
                response.status(200).send({
                    status: true,
                    msg: 'cadastrado com sucesso!!',
                    codigo: '002',
                    dados: {
                        idListaExer: p_idLista,
                        idExercicios: p_idExercicio,
                        id: respostaPromise.insertId,
                        ordem: item.ordem,
                        series: item.series,
                        reps: item.reps,
                        carga_kg: item.cargaKg,
                        descanso_seg: item.descansoSeg
                    },
                    token: jwt.gerar(entrada.dados)
                });
            });
        });
    }).catch((erro) => {
        if (erro && erro.code === 'ER_DUP_ENTRY') {
            response.status(200).send({
                status: false,
                msg: 'Esse exercício já está na lista.',
                codigo: '004',
                dados: {},
                token: jwt.gerar(entrada.dados)
            });
            return;
        }
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro ao cadastrar!!',
            codigo: '003',
            dados: {}
        });
    });
};
