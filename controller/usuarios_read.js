const Usuario = require("../model/Usuario");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    console.log("GET:/usuariosall");
    const jwt = new JWT();

    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const usuario = new Usuario(banco);
        usuario.readall().then(respostaPromise =>{
            const resposta = {
                status:true,
                msg:'sucesso!!',
                codigo:'002',
                dados: respostaPromise,
                token: jwt.gerar(validou.payload)
                   
                
            }
            response.status(200).send(resposta);
        }).catch(erro=>{
            const resposta = {
                status:false,
                msg:'erro!!',
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