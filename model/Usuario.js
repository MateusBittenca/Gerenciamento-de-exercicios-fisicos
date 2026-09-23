module.exports = class Usuario {
    constructor(banco) {
        this._banco = banco;
        this._UsuarioID = null;
        this._Nome = null;
        this._Email = null;
        this._Senha = null;
        this._Sexo = null;
        this._Altura = null;
        this._Peso = null;
        this._Telefone = null;
        this._DataNascimento = null;
        this._Foto = null;
        this._Objetivo = null;
        this._MetaSemanal = 4;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const nome = this._Nome;
            const email = this._Email;
            const senha = this._Senha;
            const sexo = this._Sexo;
            const altura = this._Altura;
            const peso = this._Peso;
            const telefone = this._Telefone;
            const dataNascimento = this._DataNascimento;
            const parametros = [nome, email, senha, sexo, altura, peso, telefone, dataNascimento];
            const sql = 'INSERT INTO usuarios (Nome,Email,Senha,Sexo,Altura,Peso,Telefone,DataNascimento) VALUES (?,?,md5(?),?,?,?,?,?);';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    resolve(JSON.stringify(resultados));
                }
            });
        });
        return operacao;
    }

    async read() {
        const operacao = new Promise((resolve, reject) => {
            const usuarioId = this._UsuarioID;
            const parametros = [usuarioId];
            const sql = 'SELECT * FROM usuarios WHERE UsuarioID = ?';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async readall() {
        const operacao = new Promise((resolve, reject) => {
            const usuarioId = this._UsuarioID;
            const parametros = [usuarioId];
            const sql = 'SELECT * FROM usuarios';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async update() {
        const operacao = new Promise((resolve, reject) => {
            const usuarioId = this._UsuarioID;
            const nome = this._Nome;
            const email = this._Email;
            const sexo = this._Sexo;
            const altura = this._Altura;
            const peso = this._Peso;
            const telefone = this._Telefone;
            const dataNascimento = this._DataNascimento;
            const foto = this._Foto;
            const objetivo = this._Objetivo;
            const metaSemanal = this._MetaSemanal;
            const parametros = [nome, email, sexo, altura, peso, telefone, dataNascimento, foto, objetivo, metaSemanal, usuarioId];
            const sql = 'UPDATE usuarios SET Nome = ?, Email = ?, Sexo = ?, Altura = ?, Peso = ?, Telefone = ?, DataNascimento = ?, Foto = ?, Objetivo = ?, MetaSemanal = ?  WHERE UsuarioID = ?;';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async updateFoto() {
        const operacao = new Promise((resolve, reject) => {
            const usuarioId = this._UsuarioID;
            const foto = this._Foto;
            const parametros = [foto, usuarioId];
            const sql = 'UPDATE usuarios SET Foto = ? WHERE UsuarioID = ?;';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async delete() {
        const operacao = new Promise((resolve, reject) => {
            const usuarioId = this._UsuarioID;
            const parametros = [usuarioId];
            const sql = "DELETE FROM usuarios WHERE UsuarioID = ?;";
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
        return operacao;
    }

    async login() {
        const operacao = new Promise((resolve, reject) => {
            const email = this._Email;
            const senha = this._Senha;
            const parametros = [email, senha];
            const sql = 'SELECT COUNT(*) as qtd,UsuarioID,Nome,Email,Senha, Sexo , Altura , Peso, Telefone, DataNascimento, Foto, Objetivo, MetaSemanal, createdAt FROM usuarios WHERE email = ? AND senha = md5(?);';
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    console.log(erro);
                    reject(erro);
                } else {
                    if (resultados[0].qtd > 0) {
                        const obj = {
                            status: true,
                            dados: {
                                usuarioId: resultados[0].UsuarioID,
                                nome: resultados[0].Nome,
                                email: resultados[0].Email,
                                sexo: resultados[0].Sexo,
                                altura: resultados[0].Altura,
                                peso: resultados[0].Peso,
                                telefone: resultados[0].Telefone,
                                dataNascimento: resultados[0].DataNascimento,
                                foto: resultados[0].Foto,
                                objetivo: resultados[0].Objetivo,
                                metaSemanal: resultados[0].MetaSemanal,
                                createdAt: resultados[0].createdAt
                            }
                        };
                        resolve(obj);
                    } else {
                        resolve({ status: false, msg: 'Falha ao fazer login' });
                    }
                }
            });
        });
        return operacao;
    }

    set banco(valor) { this._banco = valor; }
    get banco() { return this._banco; }
    set usuarioId(usuarioId) { this._UsuarioID = usuarioId; }
    get usuarioId() { return this._UsuarioID; }
    set nome(nome) { this._Nome = nome; }
    get nome() { return this._Nome; }
    set email(email) { this._Email = email; }
    get email() { return this._Email; }
    set senha(senha) { this._Senha = senha; }
    get senha() { return this._Senha; }
    set dataNasc(dataNasc) { this._DataNascimento = dataNasc; }
    get dataNasc() { return this._DataNascimento; }
    set sexo(sexo) { this._Sexo = sexo; }
    get sexo() { return this._Sexo; }
    set altura(altura) { this._Altura = altura; }
    get altura() { return this._Altura; }
    set peso(peso) { this._Peso = peso; }
    get peso() { return this._Peso; }
    set telefone(telefone) { this._Telefone = telefone; }
    get telefone() { return this._Telefone; }
    set foto(foto) { this._Foto = foto; }
    get foto() { return this._Foto; }
    set objetivo(objetivo) { this._Objetivo = objetivo; }
    get objetivo() { return this._Objetivo; }
    set metaSemanal(metaSemanal) { this._MetaSemanal = metaSemanal; }
    get metaSemanal() { return this._MetaSemanal; }
};
