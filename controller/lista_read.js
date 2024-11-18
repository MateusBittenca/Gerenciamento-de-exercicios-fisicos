const Lista = require("../model/lista");
const JWT = require("../model/JWT.js");

module.exports = function(request,response,banco){
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const lista = new Lista(banco);
        const p_usuarioId = request.params.usuarioId;
        lista.usuarioId = p_usuarioId;

        lista.read().then(respostaPromisse =>{
            const resposta = {
                status:true,
                msg:'sucesso!!',
                codigo:'002',
                dados: respostaPromisse,
                token: jwt.gerar(validou.payload)       
            }
            response.status(200).send(resposta);
        }).catch(erro =>{
            const resposta = {
                status:false,
                msg:'erro!!',
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