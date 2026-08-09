const Exercicio = require("../model/Exercicios.js");
const JWT = require("../model/JWT.js");

module.exports = function(request, response, banco){
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const exercicio = new Exercicio(banco);
        const idexercicio = request.params.idexercicio;
        
        exercicio.idexercicio = idexercicio;
        
        exercicio.readById().then(respostaPromise => {
            if(respostaPromise){
                const resposta = {
                    status: true,
                    msg: 'Exercício encontrado com sucesso!',
                    codigo: '002',
                    dados: respostaPromise,
                    token: jwt.gerar(validou.payload)       
                };
                response.status(200).send(resposta);
            } else {
                const resposta = {
                    status: false,
                    msg: 'Exercício não encontrado!',
                    codigo: '004',
                    dados: {}
                };
                response.status(404).send(resposta);
            }
        }).catch(erro => {
            console.log(erro);
            const resposta = {
                status: false,
                msg: 'Erro ao buscar exercício!',
                codigo: '003',
                dados: {}
            };
            response.status(200).send(resposta);
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
