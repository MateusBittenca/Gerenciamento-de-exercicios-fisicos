const Exercicio = require("../model/Exercicios.js");
const JWT = require('../model/JWT');
module.exports = function(request,response,banco){
    console.log("DELETE:/exercicio");
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const p_idexercicio = request.params.idexercicio;
        const exercicio = new Exercicio(banco);

        exercicio.idexercicio = p_idexercicio;
        
        exercicio.delete().then(respostaPromise=>{
            const resposta = {
                status:true,
                msg:'Deletado com sucesso!!',
                codigo:'002',
                dados:{}
            }
            response.status(200).send(resposta);

        }).catch(erro=>{
            const resposta = {
                status:false,
                msg:'erro ao deletar!!',
                codigo:'003',
                dados:{}
            }
            response.status(200).send(resposta);
        });

    }else{
        const resposta = {
            status: false,
            msg: 'Token invalido!',
            codigo: '003',
            dados: {}
        };
        response.status(200).send(resposta);
    }
   
      

    
}