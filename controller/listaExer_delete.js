const Lista = require("../model/lista_exercicios.js");
const JWT = require("../model/JWT.js");

module.exports = function(request,response,banco){
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const lista = new Lista(banco);
        const p_idlista = request.params.idListaExer;
        const p_isExercicio = request.params.idExercicios
        lista.idListaExer = p_idlista;
        lista.idExercicios = p_isExercicio;

        lista.delete().then(respostaPromisse =>{
            const resposta = {
                status:true,
                msg:'Deletado com sucesso!!',
                codigo:'002',
                dados:{}
            }
            response.status(200).send(resposta);
        }).catch(erro =>{
            const resposta = {
                status:false,
                msg:'erro ao deletar!!',
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