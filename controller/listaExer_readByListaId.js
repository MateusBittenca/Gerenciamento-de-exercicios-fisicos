const ListaExer = require("../model/lista_exercicios");
const JWT = require("../model/JWT");

module.exports = function (request, response, banco) {

    const jwt = new JWT();

    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const idLista = request.params.idLista;
        
        // Query SQL para buscar exercícios de uma lista específica
        const sql = `
            SELECT 
                e.idexercicio,
                e.nome,
                e.musculo,
                e.equipamento,
                e.dificuldade,
                e.instrucao,
                e.tipo,
                e.imagem
            FROM lista_exercicios le
            JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio
            WHERE le.lista_idlista = ?
        `;
        
        banco.query(sql, [idLista], function (erro, resultados) {
            if (erro) {
                console.log(erro);
                const resposta = {
                    status: false,
                    msg: 'Erro ao buscar exercícios da lista',
                    codigo: '003',
                    dados: {}
                };
                response.status(200).send(resposta);
            } else {
                const resposta = {
                    status: true,
                    msg: 'Exercícios da lista encontrados com sucesso',
                    codigo: '002',
                    dados: resultados,
                    token: jwt.gerar(validou.payload.payload)
                };
                response.status(200).send(resposta);
            }
        });
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
