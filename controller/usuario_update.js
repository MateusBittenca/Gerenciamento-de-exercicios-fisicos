const fs = require('fs');
const path = require('path');
const Usuario = require("../model/Usuario");
const UsuarioAfericoes = require("../model/usuario_afericoes");
const JWT = require("../model/JWT");

function calcularImc(peso, alturaMetros) {
    const p = parseFloat(peso);
    const a = parseFloat(alturaMetros);
    if (!p || !a || a <= 0) {
        return null;
    }
    return Number((p / (a * a)).toFixed(1));
}

module.exports = function(request,response,banco){
    console.log("PUT:/usuario");
    const auth = request.headers.authorization;
    const jwt = new JWT();
    const validou = jwt.validar(auth);

    if(validou.status == true){
    const dadosJwt = jwt.dados(validou);
    const admin = dadosJwt.adminID != null && dadosJwt.usuarioId == null;
    const aluno = dadosJwt.usuarioId != null && dadosJwt.adminID == null;
    if (!admin && !aluno) {
        response.status(200).send({ status: false, msg: 'Sem permissão.', codigo: '003', dados: {} });
        return;
    }
    const p_usuarioId = request.params.usuarioId;
    if (aluno && String(p_usuarioId) !== String(dadosJwt.usuarioId)) {
        response.status(200).send({ status: false, msg: 'Sem permissão.', codigo: '003', dados: {} });
        return;
    }
    const p_nome = request.body.nome;
    const p_email = request.body.email;
    const p_sexo = request.body.sexo;
    const p_altura = request.body.altura;
    const p_peso = request.body.peso;
    const p_telefone = request.body.telefone;
    const p_dataNascimento = request.body.dataNascimento || request.body.dataNasc || null;
    const p_foto = request.body.foto;
    const p_objetivo = request.body.objetivo;
    const p_meta = request.body.metaSemanal != null ? request.body.metaSemanal : request.body.MetaSemanal;

        const usuario = new Usuario(banco);
        usuario.usuarioId = p_usuarioId;

        usuario.read().then((atual) => {
            const anterior = atual && atual[0] ? atual[0] : {};
            usuario.nome = p_nome;
            usuario.email = p_email;
            usuario.sexo = p_sexo;
            usuario.altura = p_altura;
            usuario.peso = p_peso;
            usuario.telefone = p_telefone;
            usuario.dataNasc = p_dataNascimento;
            usuario.foto = p_foto != null ? p_foto : anterior.Foto;
            usuario.objetivo = p_objetivo;
            usuario.metaSemanal = p_meta != null ? p_meta : (anterior.MetaSemanal || 4);

            return usuario.update().then((respostaPromise)=>{
                const pesoMudou = String(anterior.Peso) !== String(p_peso);
                const alturaMudou = String(anterior.Altura) !== String(p_altura);
                const imc = calcularImc(p_peso, p_altura);
                const gravarAfericao = (pesoMudou || alturaMudou) && p_peso && p_altura;
                const seguir = gravarAfericao
                    ? (function () {
                        const afericao = new UsuarioAfericoes(banco);
                        afericao.usuarioId = p_usuarioId;
                        afericao.peso = p_peso;
                        afericao.altura = p_altura;
                        afericao.imc = imc;
                        return afericao.create();
                    }())
                    : Promise.resolve();

                return seguir.then(() => {
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
                            peso:p_peso,
                            telefone:p_telefone,
                            dataNascimento:p_dataNascimento,
                            foto: usuario.foto,
                            objetivo:p_objetivo,
                            metaSemanal: usuario.metaSemanal,
                            imc: imc
                        },
                         token:jwt.gerar(jwt.dados(validou))
                    }
                    response.status(200).send(resposta);
                });
            });
        }).catch(erro=>{
            console.error(erro);
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

module.exports.foto = function(request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) {
        response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
        return;
    }
    const dadosJwt = jwt.dados(validou);
    const admin = dadosJwt.adminID != null && dadosJwt.usuarioId == null;
    const aluno = dadosJwt.usuarioId != null && dadosJwt.adminID == null;
    const usuarioId = request.params.usuarioId;
    if ((!admin && !aluno) || (aluno && String(usuarioId) !== String(dadosJwt.usuarioId))) {
        response.status(200).send({ status: false, msg: 'Sem permissão.', codigo: '003', dados: {} });
        return;
    }
    const raw = request.body.foto || request.body.imagem || '';
    const match = String(raw).match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (!match) {
        response.status(200).send({ status: false, msg: 'Imagem inválida.', codigo: '001', dados: {} });
        return;
    }
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const dir = path.join(__dirname, '..', 'view', 'image', 'avatars');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filename = usuarioId + '.' + ext;
    fs.writeFileSync(path.join(dir, filename), buffer);
    const fotoPath = '/image/avatars/' + filename + '?t=' + Date.now();
    const usuario = new Usuario(banco);
    usuario.usuarioId = usuarioId;
    usuario.foto = '/image/avatars/' + filename;
    usuario.updateFoto().then(() => {
        response.status(200).send({
            status: true,
            msg: 'Foto atualizada!',
            codigo: '002',
            dados: { foto: fotoPath },
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro ao salvar foto!!', codigo: '003', dados: {} });
    });
};

module.exports.afericoes = function(request, response, banco) {
    const jwt = new JWT();
    const validou = jwt.validar(request.headers.authorization);
    if (validou.status != true) {
        response.status(200).send({ status: false, msg: 'Token invalido!', codigo: '003', dados: {} });
        return;
    }
    const dadosJwt = jwt.dados(validou);
    const admin = dadosJwt.adminID != null && dadosJwt.usuarioId == null;
    const aluno = dadosJwt.usuarioId != null && dadosJwt.adminID == null;
    if ((!admin && !aluno) || (aluno && String(request.params.usuarioId) !== String(dadosJwt.usuarioId))) {
        response.status(200).send({ status: false, msg: 'Sem permissão.', codigo: '003', dados: {} });
        return;
    }
    const afericao = new UsuarioAfericoes(banco);
    afericao.usuarioId = request.params.usuarioId;
    afericao.read().then((rows) => {
        response.status(200).send({
            status: true,
            msg: 'sucesso!!',
            codigo: '002',
            dados: rows,
            token: jwt.gerar(jwt.dados(validou))
        });
    }).catch((erro) => {
        console.error(erro);
        response.status(200).send({ status: false, msg: 'erro!!', codigo: '003', dados: {} });
    });
};
