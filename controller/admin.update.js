const Admin = require("../model/Administradores");
const JWT = require("../model/JWT");

module.exports = function(request, response, banco) {
    const jwt = new JWT();
    const entrada = jwt.entrar(request.headers.authorization, 'admin');
    if (!entrada.ok) {
        jwt.negar(response, entrada);
        return;
    }

    const p_adminID = request.params.adminID;
    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_cargo = request.body.cargo;

    const admin = new Admin(banco);
    admin.adminID = p_adminID;
    admin.read().then((rows) => {
        const atual = rows && rows[0] ? rows[0] : {};
        admin.nome = p_nome;
        admin.email = p_email;
        admin.cargo = p_cargo || atual.Cargo;
        return admin.update();
    }).then(() => {
        response.status(200).send({
            status: true,
            msg: 'atualizado com sucesso!!',
            codigo: '002',
            dados: {
                adminID: p_adminID,
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
            msg: 'erro ao atualizar!!',
            codigo: '003',
            dados: {}
        });
    });
};
