const ListaExer = require("../model/lista_exercicios");
const Lista = require("../model/lista");
const JWT = require("../model/JWT");
const prescricao = require("../model/prescricao");

module.exports = function (request, response, banco) {

    const jwt = new JWT();
    const auth = request.headers.authorization;
    const validou = jwt.validar(auth);

    if(validou.status == true){
        const p_idLista = request.body.idListaExer;
        const p_idExercicio = request.body.idExercicios;

        if (p_idLista == '' || p_idExercicio == '' || p_idLista == null || p_idExercicio == null) {
            const resposta = {
                status:false,
                msg:'Não pode ter valores nulos!!',
                codigo:'001',
                dados:{}
            }
            response.status(200).send(resposta)
        }else{
            const aplicarDefaults = function(objetivo) {
                const def = prescricao.paraObjetivo(objetivo);
                const listaId = new ListaExer(banco);
                listaId.idListaExer = p_idLista;
                listaId.idExercicios = p_idExercicio;
                listaId.ordem = request.body.ordem || 1;
                listaId.series = request.body.series || def.series;
                listaId.reps = request.body.reps || def.reps;
                listaId.cargaKg = request.body.carga_kg != null ? request.body.carga_kg : (request.body.cargaKg != null ? request.body.cargaKg : null);
                listaId.descansoSeg = request.body.descanso_seg || request.body.descansoSeg || def.descanso_seg;
                listaId.observacao = request.body.observacao || null;
                return listaId.create().then(respostaPromise => {
                    const resposta = {
                        status:true,
                        msg:'cadastrado com sucesso!!',
                        codigo:'002',
                        dados:{
                            idListaExer:p_idLista,
                            idExercicios:p_idExercicio,
                            id: respostaPromise.insertId,
                            series: listaId.series,
                            reps: listaId.reps,
                            carga_kg: listaId.cargaKg,
                            descanso_seg: listaId.descansoSeg
                        },
                        token:jwt.gerar(jwt.dados(validou))
                    }
                    response.status(200).send(resposta);
                });
            };

            const lista = new Lista(banco);
            lista.idLista = p_idLista;
            lista.readById().then((rows) => {
                const objetivo = rows && rows[0] ? rows[0].objetivo : 'hipertrofia';
                return aplicarDefaults(objetivo);
            }).catch(erro => {
                console.error(erro);
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
