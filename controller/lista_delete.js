const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function(request,response,banco){
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const lista = new Lista(banco);
        const p_idlista = request.params.idLista;
        lista.idLista = p_idlista;

        lista.delete().then(respostaPromisse =>{
            const resposta = {
                status:true,
                msg:'Deletado com sucesso!!',
                codigo:'002',
                dados:{},
                token:jwt.gerar(validou.payload.payload)
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