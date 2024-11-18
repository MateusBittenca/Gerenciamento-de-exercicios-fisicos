const Usuario = require("../model/Usuario");
const JWT = require("../model/JWT");
module.exports = function(request,response,banco){
    console.log("DELETE:/usuario");

    const p_usuarioId = request.params.usuarioId;
    const usuario = new Usuario(banco);
    const jwt = new JWT();

    usuario.usuarioId = p_usuarioId;

    usuario.delete().then(respostaPromisse=>{
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
}