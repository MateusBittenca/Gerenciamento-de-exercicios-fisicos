const jwt = require('jsonwebtoken');
module.exports = class JWT{

    constructor(){
        this._jsonwebtoken = jwt;
        this._jwt_key = 'dkajwjkjw1jk31dawdsawdsaw';
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
    
}