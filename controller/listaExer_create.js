const ListaExer = require("../model/lista_exercicios");
const JWT = require("../model/JWT");

module.exports = function (request, response, banco) {

    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if (validou.status == true) {
        const p_idLista = request.body.idListaExer;
        const p_idExercicio = request.body.idExercicios;

        if (p_idLista == '' || p_idExercicio == '') {
            const resposta = {
                status:false,
                msg:'Não pode ter valores nulos!!',
                codigo:'001',
                dados:{}
            }
            response.status(200).send(resposta)
        }else{
            const listaId = new ListaExer(banco);
            listaId.idListaExer = p_idLista;
            listaId.idExercicios = p_idExercicio;
    
            listaId.create().then(respostaPromise =>{

                const resposta = {
                    status:true,
                    msg:'cadastrado com sucesso!!',
                    codigo:'002',
                    dados:{
                        idListaExer:p_idLista,
                        idExercicios:p_idExercicio,       
                    },
                    token:jwt.gerar(validou.payload)
                }   
                response.status(200).send(resposta);
            }).catch(erro => {
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