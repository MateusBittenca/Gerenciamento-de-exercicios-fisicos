const Usuario = require("../model/Usuario");

module.exports = function(request, response, banco) {

    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_senha = request.body.senha;
    const p_sexo = request.body.sexo;
    const p_altura = request.body.altura;
    const p_peso = request.body.peso;

    const p_telefone = request.body.telefone || null;
    const p_dataNascimento = request.body.dataNascimento || request.body.dataNasc || null;

    if (p_nome == '' || p_email == '' || p_senha == '' || p_sexo == '' || p_altura == '' || p_peso =='' ) {
        const resposta = {
            status: false,
            msg: 'Não pode ter valores nulos!!',
            codigo: '001',
            dados: {}
        };
        response.status(200).send(resposta);
    } else if (isNaN(p_altura) || isNaN(p_peso)) {
        const resposta = {
            status: false,
            msg: 'Não pode conter caracteres!',
            codigo: '004',
            dados: {}
        };
        response.status(200).send(resposta);
    } else {
        const usuario = new Usuario(banco);

        usuario.nome = p_nome;
        usuario.email = p_email;
        usuario.senha = p_senha;
        usuario.sexo = p_sexo;
        usuario.altura = parseFloat(p_altura);
        usuario.peso = parseFloat(p_peso);
        usuario.telefone = p_telefone;
        usuario.dataNasc = p_dataNascimento;
        

        usuario.create().then(respostaPromisse => {
            const resposta = {
                status: true,
                msg: "Usuario cadastrado com sucesso!!",
                codigo: "002",
                dados: {
                    UsuarioID: respostaPromisse.insertId,
                    nome: p_nome,
                    email: p_email,
                    sexo: p_sexo,
                    altura: p_altura,
                    peso: p_peso
                }
            };
            response.status(200).send(resposta);
        }).catch(erro => {
            const resposta = {
                status: false,
                msg: 'Erro ao cadastrar!!',
                codigo: '003',
                dados: {}
            };
            response.status(200).send(resposta);
        });
    }
}
