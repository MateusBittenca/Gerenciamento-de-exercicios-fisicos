const Exercicio = require("../model/Exercicios.js");
const JWT = require('../model/JWT');
module.exports = function(request,response,banco){
    console.log("POST:/exercicio");
    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){

        const p_idexercicio = request.params.idexercicio;
        const p_nome = request.body.nome;
        const p_musculo = request.body.musculo;
        const p_equipamento = request.body.equipamento;
        const p_dificuldade = request.body.dificuldade;
        const p_instrucao = request.body.instrucao;
        const p_tipo = request.body.tipo;
        const p_imagem = request.body.imagem;
  
            const exercicio = new Exercicio(banco);
    
            exercicio.idexercicio = p_idexercicio;
            exercicio.nome = p_nome;
            exercicio.musculo = p_musculo;
            exercicio.equipamento = p_equipamento;
            exercicio.dificuldade = p_dificuldade;
            exercicio.instrucao = p_instrucao;
            exercicio.tipo = p_tipo;
            exercicio.imagem = p_imagem;
    
            exercicio.update().then(respostaPromise=>{
                const resposta = {
                    status:true,
                    msg:'atualizado com sucesso!!',
                    codigo:'002',
                    dados:{
                        idexercicio:p_idexercicio,
                        nome:p_nome,
                        musculo:p_musculo,
                        equipamento:p_equipamento,
                        dificuldade:p_dificuldade,
                        instrucao:p_instrucao,
                        tipo:p_tipo,
                        imagem:p_imagem
                    },
                    token:jwt.gerar(validou.payload)
                }
                response.status(200).send(resposta)
    
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
            status: false,
            msg: 'Token invalido!',
            codigo: '003',
            dados: {}
        };
        response.status(200).send(resposta);
    }
}