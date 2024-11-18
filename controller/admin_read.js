const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    console.log("GET:/admin");
    const jwt = new JWT();

    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const admin = new Admin(banco);
        const p_adminID = request.params.adminID;

        admin.adminID = p_adminID;
        admin.read().then(respostaPromisse =>{
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