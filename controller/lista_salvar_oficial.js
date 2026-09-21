const Lista = require("../model/lista");
const ListaExer = require("../model/lista_exercicios");
const JWT = require('../model/JWT');

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if (validou.status != true) {
        response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
        return;
    }

    const dados = jwt.dados(validou);
    const usuarioId = dados.usuarioId;
    const idLista = request.body.idLista || request.body.idlista;

    if (!usuarioId || !idLista) {
        response.status(200).send({ status: false, msg: 'Dados insuficientes.', codigo: '001', dados: {} });
        return;
    }

    const origemCheck = new Lista(banco);
    origemCheck.usuarioId = usuarioId;
    origemCheck.listaOrigemId = idLista;

    origemCheck.readOrigemDoUsuario().then(async (existentes) => {
        if (existentes && existentes.length > 0) {
            response.status(200).send({
                status: false,
                msg: 'Você já salvou esta lista oficial.',
                codigo: '004',
                dados: { idlista: existentes[0].idlista },
                token: jwt.gerar(jwt.dados(validou))
            });
            return;
        }

        const origem = new Lista(banco);
        origem.idLista = idLista;
        const rows = await origem.readById();
        if (!rows || rows.length === 0) {
            response.status(200).send({ status: false, msg: 'Lista oficial não encontrada.', codigo: '003', dados: {} });
            return;
        }
        const fonte = rows[0];

        const nova = new Lista(banco);
        nova.nome = fonte.nome;
        nova.tipo = fonte.tipo;
        nova.usuarioId = usuarioId;
        nova.objetivo = fonte.objetivo || 'hipertrofia';
        nova.diasSemana = fonte.dias_semana;
        nova.listaOrigemId = fonte.idlista;
        const criada = await nova.create();

        const origemExer = new ListaExer(banco);
        origemExer.idListaExer = fonte.idlista;
        const exercicios = await origemExer.readByListaId();

        for (let i = 0; i < exercicios.length; i++) {
            const item = exercicios[i];
            const linha = new ListaExer(banco);
            linha.idListaExer = criada.insertId;
            linha.idExercicios = item.id_exercicio;
            linha.ordem = item.ordem || (i + 1);
            linha.series = item.series;
            linha.reps = item.reps;
            linha.cargaKg = item.carga_kg;
            linha.descansoSeg = item.descanso_seg;
            linha.observacao = item.observacao;
            await linha.create();
        }

        response.status(200).send({
            status: true,
            msg: 'Lista salva na sua rotina!',
            codigo: '002',
            dados: {
                idlista: criada.insertId,
                nome: fonte.nome,
                tipo: fonte.tipo,
                objetivo: fonte.objetivo,
                dias_semana: fonte.dias_semana,
                usuarioId: usuarioId
            },
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao copiar lista!!', codigo: '003', dados: {} });
    });
};
