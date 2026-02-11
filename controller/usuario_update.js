const Usuario = require("../model/Usuario");
const JWT = require("../model/JWT");
module.exports = function(request,response,banco){
    console.log("PUT:/usuario");
    const auth = request.headers.authorization;
    console.log(auth);
    const jwt = new JWT();
    const validou = jwt.validar(auth);

    if(validou.status == true){
    const p_usuarioId = request.params.usuarioId;
    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_senha = request.body.senha;
    const p_sexo = request.body.sexo;
    const p_altura = request.body.altura;
    const p_peso = request.body.peso;


        const usuario = new Usuario(banco);

        usuario.usuarioId = p_usuarioId;
        usuario.nome = p_nome;
        usuario.email = p_email;
        //usuario.senha = p_senha;
        usuario.sexo = p_sexo;
        usuario.altura = p_altura;
        usuario.peso = p_peso;

        usuario.update().then((respostaPromise)=>{
            const resposta = {
                status:true,
                msg:'atualizado com sucesso!!',
                codigo:'002',
                dados:{
                    usuarioId:p_usuarioId,
                    nome:p_nome,
                    email:p_email,
                    sexo:p_sexo,
                    altura:p_altura,
                    peso:p_peso
                },
                 token:jwt.gerar(validou.payload.payload)
            }
            response.status(200).send(resposta);
        }).catch(erro=>{
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