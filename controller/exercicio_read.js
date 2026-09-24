const Exercicio = require("../model/Exercicios.js");
const JWT = require("../model/JWT.js");
module.exports = function(request,response,banco){
    console.log("GET:/exercicio");
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'qualquer');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const exercicio = new Exercicio(banco);
        exercicio.read().then(respostaPromise=>{
            const resposta = {
                status:true,
                msg:'sucesso!!',
                codigo:'002',
                dados: respostaPromise,
                token: jwt.gerar(entrada.dados)       
            }
            response.status(200).send(resposta);

        }).catch(erro=>{
            const resposta = {
                status:false,
                msg:'erro!!',
                codigo:'003',
                dados:{}
            }
            response.status(200).send(resposta);
        });
}