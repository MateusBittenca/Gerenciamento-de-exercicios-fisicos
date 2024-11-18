const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    console.log("DELETE:/admin");

    const jwt = new JWT();

    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const p_adminID = request.params.adminID;
        const admin = new Admin(banco);
        admin.adminID = p_adminID;

        admin.delete().then(respostaPromisse=>{
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

   
    
}