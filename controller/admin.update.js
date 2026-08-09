const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    console.log("PUT:/admin");
    const auth = request.headers.authorization;
    const jwt = new JWT();
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const p_adminID = request.params.adminID;
        const p_nome = request.body.nome;
        const p_email = request.body.email;
        const p_senha = request.body.senha;

        const admin = new Admin(banco);
        admin.adminID = p_adminID;
        admin.nome = p_nome;
        admin.email = p_email;
        admin.senha = p_senha;

        admin.update().then((respostaPromisse)=>{
            const resposta = {
                status:true,
                msg:'atualizado com sucesso!!',
                codigo:'002',
                dados:{
                    adminID:p_adminID,
                    nome:p_nome,
                    email:p_email,
                    senha:p_senha
                   
                },
                 token:jwt.gerar(validou.payload)
            }
            response.status(200).send(resposta);
        }).catch(erro =>{
            const resposta = {
                status:false,
                msg:'erro ao atualizar!!',
                codigo:'003',
                dados:{}
            }
            response.status(200).send(resposta);
        });
    }else{
        const resposta = {
            status:false,
            msg:"Token invalido!!!",
            codigo:"003",
            dados:{}
        }
        response.status(200).send(resposta); 
    }
}