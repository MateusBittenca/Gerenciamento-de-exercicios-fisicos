const jwt = require('jsonwebtoken');
module.exports = class JWT{

    constructor(){
        this._jsonwebtoken = jwt;
        this._jwt_key = process.env.UNIFIT_JWT_SECRET || 'dkajwjkjw1jk31dawdsawdsaw';
        this._duracao = 60*60*24;
    }
    gerar(payload){
        const novoToken = this._jsonwebtoken.sign(
            {payload:payload},
            this._jwt_key,
            {expiresIn:this._duracao}
        );
            return novoToken;
    }
    validar(token){
        if (!token) {
            const resposta = {
                status: false,
                payload: {}
            };
            return resposta;
        }    
        token = this.limparEntrada(token);
        try{
            const payload = this._jsonwebtoken.verify(token,this._jwt_key);
            const resposta = {
                status:true,
                payload:payload
            };
            return resposta;
        } catch(erro){
            const resposta = {
                status:false,
                payload:{}
            };
            return resposta;
        }
    }
    limparEntrada(token){
        const tokenArray = token.split(" ");
        token = tokenArray[1];
        token = token.replace("<",""); 
        token = token.replace(">","");    
        return token;
    }
    dados(validou){
        let p = validou && validou.payload;
        while (p && p.payload && p.usuarioId == null && p.adminID == null) {
            p = p.payload;
        }
        return p || {};
    }
    entrar(header, papel) {
        const validou = this.validar(header);
        if (validou.status != true) {
            return { ok: false, motivo: 'token' };
        }
        const dados = this.dados(validou);
        const admin = dados.adminID != null && dados.usuarioId == null;
        const aluno = dados.usuarioId != null && dados.adminID == null;
        if (papel === 'admin' && !admin) {
            return { ok: false, motivo: 'papel' };
        }
        if (papel === 'user' && !aluno) {
            return { ok: false, motivo: 'papel' };
        }
        if (papel === 'qualquer' && !admin && !aluno) {
            return { ok: false, motivo: 'papel' };
        }
        return {
            ok: true,
            validou: validou,
            dados: dados,
            admin: admin,
            aluno: aluno,
            usuarioId: dados.usuarioId
        };
    }
    negar(response, entrada) {
        const semPapel = entrada && entrada.motivo === 'papel';
        response.status(200).send({
            status: false,
            msg: semPapel ? 'Sem permissão.' : 'Token invalido!',
            codigo: '003',
            dados: {}
        });
    }
}