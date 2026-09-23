const TreinoSessao = require("../model/treino_sessao");
const TreinoSerie = require("../model/treino_serie");
const ListaExer = require("../model/lista_exercicios");
const JWT = require("../model/JWT");

function recusar(response) {
    response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
}

async function montarSessao(banco, sessaoId) {
    const sessao = new TreinoSessao(banco);
    sessao.id = sessaoId;
    const rows = await sessao.readById();
    if (!rows || rows.length === 0) {
        return null;
    }
    const series = new TreinoSerie(banco);
    series.sessaoId = sessaoId;
    const itens = await series.readBySessao();
    return { sessao: rows[0], series: itens };
}

module.exports.iniciar = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const usuarioId = dados.usuarioId;
    const idLista = request.body.idLista || request.body.idlista;

    if (!usuarioId || !idLista) {
        response.status(200).send({ status: false, msg: 'Dados insuficientes.', codigo: '001', dados: {} });
        return;
    }

    const sessaoModel = new TreinoSessao(banco);
    sessaoModel.usuarioId = usuarioId;
    sessaoModel.readAtiva().then(async (ativas) => {
        if (ativas && ativas.length > 0) {
            const atual = await montarSessao(banco, ativas[0].id);
            response.status(200).send({
                status: true,
                msg: 'Já existe um treino em andamento.',
                codigo: '002',
                dados: atual,
                token: jwt.gerar(jwt.dados(validou))
            });
            return;
        }

        const listaExer = new ListaExer(banco);
        listaExer.idListaExer = idLista;
        const exercicios = await listaExer.readByListaId();
        if (!exercicios || exercicios.length === 0) {
            response.status(200).send({ status: false, msg: 'A lista não tem exercícios.', codigo: '001', dados: {} });
            return;
        }

        sessaoModel.listaId = idLista;
        const criada = await sessaoModel.create();
        const sessaoId = criada.insertId;

        for (let i = 0; i < exercicios.length; i++) {
            const item = exercicios[i];
            const qtd = item.series || 3;
            const hist = new TreinoSerie(banco);
            hist.usuarioId = usuarioId;
            hist.exercicioId = item.id_exercicio;
            const ultimas = await hist.historicoCarga();
            const cargaInicial = (ultimas[0] && ultimas[0].carga_kg) || item.carga_kg || null;
            for (let n = 1; n <= qtd; n++) {
                const serie = new TreinoSerie(banco);
                serie.sessaoId = sessaoId;
                serie.listaExercicioId = item.id_lista_exercicio;
                serie.exercicioId = item.id_exercicio;
                serie.numeroSerie = n;
                serie.cargaKg = cargaInicial;
                serie.repsFeitas = null;
                await serie.create();
            }
        }

        const dadosSessao = await montarSessao(banco, sessaoId);
        response.status(200).send({
            status: true,
            msg: 'Treino iniciado!',
            codigo: '002',
            dados: dadosSessao,
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao iniciar treino!!', codigo: '003', dados: {} });
    });
};

module.exports.ativa = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const sessaoModel = new TreinoSessao(banco);
    sessaoModel.usuarioId = dados.usuarioId;
    sessaoModel.readAtiva().then(async (ativas) => {
        let payload = null;
        if (ativas && ativas.length > 0) {
            payload = await montarSessao(banco, ativas[0].id);
        }
        response.status(200).send({ status: true, msg: 'sucesso!!', codigo: '002', dados: payload, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};

module.exports.read = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    montarSessao(banco, request.params.id).then((payload) => {
        if (!payload) {
            response.status(200).send({ status: false, msg: 'Treino não encontrado.', codigo: '003', dados: {} });
            return;
        }
        response.status(200).send({ status: true, msg: 'sucesso!!', codigo: '002', dados: payload, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};

module.exports.serie = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const serie = new TreinoSerie(banco);
    serie.id = request.body.id;
    serie.sessaoId = request.params.id;
    serie.cargaKg = request.body.carga_kg != null ? request.body.carga_kg : request.body.cargaKg;
    serie.repsFeitas = request.body.reps_feitas != null ? request.body.reps_feitas : request.body.repsFeitas;
    serie.concluida = request.body.concluida ? 1 : 0;
    serie.update().then(() => {
        return montarSessao(banco, request.params.id);
    }).then((payload) => {
        response.status(200).send({ status: true, msg: 'série atualizada!!', codigo: '002', dados: payload, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao atualizar série!!', codigo: '003', dados: {} });
    });
};

function encerrar(status) {
    return function (request, response, banco) {
        const jwt = new JWT();
        const validou = jwt.validar(request.headers.authorization);
        if (validou.status != true) { recusar(response); return; }
        const dados = jwt.dados(validou);
        const sessao = new TreinoSessao(banco);
        sessao.id = request.params.id;
        sessao.usuarioId = dados.usuarioId;
        sessao.status = status;
        sessao.duracaoSeg = request.body.duracao_seg || request.body.duracaoSeg || null;
        sessao.encerrar().then(() => {
            response.status(200).send({
                status: true,
                msg: status === 'concluida' ? 'Treino concluído!' : 'Treino cancelado.',
                codigo: '002',
                dados: { id: request.params.id, status: status },
                token: jwt.gerar(jwt.dados(validou))
            });
        }).catch((erro) => {
            console.error(erro);
            response.status(200).send({ status: false, msg: 'erro ao encerrar treino!!', codigo: '003', dados: {} });
        });
    };
}

module.exports.concluir = encerrar('concluida');
module.exports.cancelar = encerrar('cancelada');

module.exports.historicoCarga = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const serie = new TreinoSerie(banco);
    serie.usuarioId = dados.usuarioId;
    serie.exercicioId = request.params.idExercicio;
    serie.historicoCarga().then((rows) => {
        response.status(200).send({ status: true, msg: 'sucesso!!', codigo: '002', dados: rows, token: jwt.gerar(jwt.dados(validou)) });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};

module.exports.resumo = function (request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) { recusar(response); return; }
    const dados = jwt.dados(validou);
    const sessao = new TreinoSessao(banco);
    sessao.usuarioId = dados.usuarioId;

    const agora = new Date();
    const ano = parseInt(request.query.ano) || agora.getFullYear();
    const mes = parseInt(request.query.mes) || (agora.getMonth() + 1);

    Promise.all([
        sessao.readAtiva(),
        sessao.contarConcluidasMes(),
        sessao.diasTreinados(ano, mes),
        sessao.contarTotal()
    ]).then(async ([ativas, mes_count, dias, total]) => {
        let sessaoAtiva = null;
        if (ativas && ativas.length > 0) {
            sessaoAtiva = await montarSessao(banco, ativas[0].id);
        }
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: {
                sessaoAtiva: sessaoAtiva,
                concluidasMes: mes_count && mes_count[0] ? mes_count[0].qtd : 0,
                diasTreinados: dias || [],
                totalTreinos: total || 0
            },
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};
