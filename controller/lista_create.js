const Lista = require("../model/lista");
const JWT = require('../model/JWT');

module.exports = function(request,response,banco){
    console.log("POST:/lista");

    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){

        const p_nome = request.body.nome;
        const p_tipo = request.body.tipo;
        const p_usuario = request.body.usuarioId;

        if(p_nome == '' || p_tipo == ''){
            const resposta = {
                status:false,
                msg:'Não pode ter valores nulos!!',
                codigo:'001',
                dados:{}
            }
            response.status(200).send(resposta)
        }else{
            const lista = new Lista(banco);
            lista.nome = p_nome;
            lista.tipo = p_tipo;
            lista.usuarioId = p_usuario;

            lista.create().then(respostaPromisse =>{
                const resposta = {
                    status:true,
                    msg:'cadastrado com sucesso!!',
                    codigo:'002',
                    dados:{
                        idlista:respostaPromisse.insertId,
                        nome:p_nome,
                        tipo:p_tipo,
                        usuarioId:p_usuario,
                       
                    },
                    token:jwt.gerar(validou.payload)
                }   
                response.status(200).send(resposta);
            }).catch(erro =>{
                console.error(erro)
                const resposta = {
                    status:false,
                    msg:'erro ao cadastrar!!',
                    codigo:'003',
                    dados:{}
                }
                response.status(200).send(resposta);
            });
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