const Lista = require("../model/lista");
const JWT = require('../model/JWT');

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_nome = request.body.nome;
    const p_tipo = request.body.tipo;
    const p_usuario = entrada.admin ? null : entrada.usuarioId;
    const p_objetivo = request.body.objetivo || 'hipertrofia';
    const p_dias = request.body.dias_semana || request.body.diasSemana || null;

    if (p_nome == '' || p_tipo == '' || p_nome == null || p_tipo == null) {
        response.status(200).send({
            status: false,
            msg: 'Não pode ter valores nulos!!',
            codigo: '001',
            dados: {}
        });
        return;
    }

    const lista = new Lista(banco);
    lista.nome = p_nome;
    lista.tipo = p_tipo;
    lista.usuarioId = p_usuario;
    lista.objetivo = p_objetivo;
    lista.diasSemana = p_dias;

    lista.create().then((respostaPromisse) => {
        response.status(200).send({
            status: true,
            msg: 'cadastrado com sucesso!!',
            codigo: '002',
            dados: {
                idlista: respostaPromisse.insertId,
                nome: p_nome,
                tipo: p_tipo,
                usuarioId: p_usuario,
                objetivo: p_objetivo,
                dias_semana: p_dias
            },
            token: jwt.gerar(entrada.dados)
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro ao cadastrar!!',
            codigo: '003',
            dados: {}
        });
    });
};
