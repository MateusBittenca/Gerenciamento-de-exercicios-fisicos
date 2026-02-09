
module.exports = class Exercicio {

    constructor(banco){
        this._banco = banco;
        this._idexercicio = null;
        this._nome = null;
        this._musculo = null;
        this._equipamento = null;
        this._dificuldade = null;
        this._instrucao = null;
        this._tipo = null;
        this._imagem = null;
    }


    async create(){
        const operacao = new Promise((resolve,reject)=>{
            const nome = this._nome;
            const musculo = this._musculo;
            const equipamento = this._equipamento;
            const dificuldade = this._dificuldade;
            const instrucao = this._instrucao;
            const tipo = this._tipo;
            const imagem = this._imagem;

            const parametros = [nome,musculo,equipamento,dificuldade,instrucao,tipo,imagem];

            const sql = 'INSERT INTO exercicios (nome,musculo,equipamento,dificuldade,instrucao,tipo,imagem) VALUES (?,?,?,?,?,?,?);';
            this._banco.query(sql,parametros,function(erro,resultados){
                if(erro){
                    console.log(erro);
                    reject(erro);
                }else{
                    
                    resolve(JSON.stringify(resultados));

                }
            });
        });
        return operacao;
    }

    async read(){
        const operacao = new Promise((resolve,reject)=>{
            
            const parametros = [];
            const sql = 'SELECT * FROM exercicios;';

            this._banco.query(sql,parametros,function(erro,resultados){
                if(erro){
                    console.log(erro);
                    reject(erro);
                }else{
                    resolve(resultados);
                }
            });
        });

        return operacao;
    }

    async readById(){
        const operacao = new Promise((resolve,reject)=>{
            const idexercicio = this._idexercicio;
            const parametros = [idexercicio];
            const sql = 'SELECT * FROM exercicios WHERE idexercicio = ?;';

            this._banco.query(sql,parametros,function(erro,resultados){
                if(erro){
                    console.log(erro);
                    reject(erro);
                }else{
                    resolve(resultados[0] || null);
                }
            });
        });

        return operacao;
    }

    async update(){
        const operacao = new Promise((resolve,reject)=>{
            const idexercicio = this._idexercicio;
            const nome = this._nome;
            const musculo = this._musculo;
            const equipamento = this._equipamento;
            const dificuldade = this._dificuldade;
            const instrucao = this._instrucao;
            const tipo = this._tipo;
            const imagem = this._imagem;

            const parametros = [nome,musculo,equipamento,dificuldade,instrucao,tipo,imagem,idexercicio];
            const sql = "UPDATE exercicios SET nome = ?, musculo = ?, equipamento = ?, dificuldade = ?, instrucao = ?, tipo = ? , imagem = ? WHERE idexercicio = ?;";
            this._banco.query(sql,parametros,function(erro,resultados){
                if(erro){
                    console.log(erro);
                    reject(erro);
                }else{
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async delete(){
        const operacao = new Promise((resolve,reject)=>{
            const idexercicio = this._idexercicio;
            const parametros = [idexercicio];

            const sql = "DELETE FROM exercicios WHERE idexercicio = ?;";
            this._banco.query(sql,parametros,function(erro,resultados){
                if(erro){
                    reject(erro);
                }else{
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    set banco(valor){
         this._banco = valor;
    }
    get banco(){
        return this._banco;
    }

    set idexercicio(idexercicio){
        this._idexercicio = idexercicio;
    }
    get idexercicio(){
        return this._idexercicio;
    }

    set nome(nome){
        this._nome = nome;
    }
    get nome(){
        return this._nome;
    }

    set musculo(musculo){
        this._musculo = musculo;
    }
    get musculo(){
        return this._musculo;
    }

    set equipamento(equipamento){
        this._equipamento = equipamento;
    }
    get equipamento(){
        return this._equipamento;
    }

    set dificuldade(dificuldade){
        this._dificuldade = dificuldade;
    }
    get dificuldade(){
        return this._dificuldade;
    }

    set instrucao(instrucao){
        this._instrucao = instrucao;
    }
    get instrucao(){
        return this._instrucao;
    }

    set tipo(tipo){
        this._tipo = tipo;
    }

    get tipo(){
        return this._tipo;
    }

    set imagem(imagem){
        this._imagem = imagem;
    }

    get imagem(){
        return this._imagem;
    }

}