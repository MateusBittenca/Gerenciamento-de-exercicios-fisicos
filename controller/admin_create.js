const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    console.log("POST:/admin");
    const jwt = new JWT();

    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){

    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_senha = request.body.senha;
    const p_cargo = request.body.cargo

    if(p_nome == ''|| p_email == '' || p_senha == ''|| p_cargo == ''){
        const resposta = {
            status:false,
            msg:'Não pode ter valores nulos!!',
            codigo:'001',
            dados:{}
        }
        response.status(200).send(resposta)
    }else{
        const admin = new Admin(banco);

        admin.nome = p_nome;
        admin.email = p_email;
        admin.senha = p_senha;
        admin.cargo = p_cargo;

        admin.create().then(respostaPromisse=>{
            const resposta = {
                status:true,
                msg:"ADM cadastrado com sucesso!!",
                codigo:"002",
                dados:{
                    adminID:respostaPromisse.insertId,
                    nome:p_nome,
                    email:p_email,
                    senha:p_senha,
                    cargo:p_cargo
         
                },
                token: jwt.gerar(validou.payload.payload)
               
            }
            response.status(200).send(resposta);
        })
    }
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