const Exerfav = require("../model/ExerciciosFav");
const JWT = require('../model/JWT');
module.exports = function(request,response,banco){
    console.log("DELETE:/exerfav");
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const exerciciofav = new Exerfav(banco);
        const p_usuarioId = request.params.usuarioId;
        const p_exercicioId = request.params.exercicioId;
        exerciciofav.usuarioId = p_usuarioId;
        exerciciofav.exercicioId = p_exercicioId;

        exerciciofav.delete().then(respostaPromisse =>{
            const resposta = {
                status:true,
                msg:'Removido dos favoritos com sucesso!!',
                codigo:'002',
                dados:{}
            }
            response.status(200).send(resposta);
        }).catch(erro =>{
            const resposta = {
                status:false,
                msg:'erro ao remover dos favoritos!!',
                codigo:'003',
                dados:{}
            }
            response.status(200).send(resposta);
        })


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