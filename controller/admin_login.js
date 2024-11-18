const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request,response,banco){
    const p_email = request.body.email;
    const p_senha = request.body.senha;

    if(p_email == '' || p_senha == ''){
        const resposta = {
            status: false,
            msg: 'Não pode conter espaços vazios!',
            codigo: '001',
            dados: {}
        }
        response.status(200).send(resposta);
    }else{

        const admin = new Admin(banco);
        admin.email = p_email;
        admin.senha = p_senha;

        admin.login().then(resposta => {

            if(resposta.status == true){
                const jwt = new JWT();
                const token = jwt.gerar(resposta.dados);

                const obj = {
                    status:true,
                    msg:'Sucesso',
                    codigo: '002',
                    dados: resposta.dados,
                    token: token
                };
                response.status(200).send(obj);
            }else{
                const obj = {
                    status: false,
                    msg: 'Login inválido',
                    codigo: '002',
                    dados: {},
                    token: {}
                };
                response.status(200).send(obj);
            }
        });
    }
};