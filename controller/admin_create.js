const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'admin');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_senha = request.body.senha;
    const p_cargo = request.body.cargo;

    if (p_nome == '' || p_email == '' || p_senha == '' || p_cargo == '' || p_nome == null || p_email == null || p_senha == null || p_cargo == null) {
        response.status(200).send({
            status: false,
            msg: 'Não pode ter valores nulos!!',
            codigo: '001',
            dados: {}
        });
        return;
    }

    const admin = new Admin(banco);
    admin.nome = p_nome;
    admin.email = p_email;
    admin.senha = p_senha;
    admin.cargo = p_cargo;

    admin.create().then((respostaPromisse) => {
        response.status(200).send({
            status: true,
            msg: 'ADM cadastrado com sucesso!!',
            codigo: '002',
            dados: {
                adminID: respostaPromisse.insertId,
                nome: p_nome,
                email: p_email,
                cargo: p_cargo
            },
            token: jwt.gerar(entrada.dados)
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({
            status: false,
            msg: 'erro ao cadastrar!!',
            codigo: '003',
            dados: {}
        });
    });
};
