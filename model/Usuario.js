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
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const nome = this._Nome;
            const email = this._Email;
            const senha = this._Senha;

            const sexo = this._Sexo;
            const altura = this._Altura;
            const peso = this._Peso;


            const parametros = [nome, email, senha, sexo, altura, peso];

            const sql = 'INSERT INTO usuarios (Nome,Email,Senha,Sexo,Altura,Peso) VALUES (?,?,md5(?),?,?,?);';
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
            const senha = this._Senha;
            const sexo = this._Sexo;
            const altura = this._Altura;
            const peso = this._Peso;


            const parametros = [nome, email/*senha */, sexo, altura, peso, usuarioId];
            const sql = 'UPDATE usuarios SET Nome = ?, Email = ?, Sexo = ?, Altura = ?,Peso = ?  WHERE UsuarioID = ?;';

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
            const sql = 'SELECT COUNT(*) as qtd,UsuarioID,Nome,Email,Senha, Sexo , Altura , Peso FROM usuarios WHERE email = ? AND senha = md5(?);';
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
                                //senha:resultados[0].Senha,
                                sexo: resultados[0].Sexo,
                                altura: resultados[0].Altura,
                                peso: resultados[0].Peso
                            }
                        }

                        resolve(obj);
                    } else {
                        const obj = {
                            status: false,
                            msg: 'Falha ao fazer login'
                        }
                        resolve(obj);
                    }
                }
            });
        });
        return operacao;
    }

    set banco(valor) {
        this._banco = valor;
    }

    get banco() {
        return this._banco;
    }

    set usuarioId(usuarioId) {
        this._UsuarioID = usuarioId;
    }

    get usuarioId() {
        return this._UsuarioID;
    }

    set nome(nome) {
        this._Nome = nome;
    }
    get nome() {
        return this._Nome;
    }

    set email(email) {
        this._Email = email;
    }

    get email() {
        return this._Email;
    }

    set senha(senha) {
        this._Senha = senha;
    }

    get senha() {
        return this._Senha;
    }

    set dataNasc(dataNasc) {
        this._DataDeNascimento = dataNasc;
    }

    get dataNasc() {
        return this._DataDeNascimento;
    }

    set sexo(sexo) {
        this._Sexo = sexo;
    }

    get sexo() {
        return this._Sexo;
    }

    set altura(altura) {
        this._Altura = altura;
    }

    get altura() {
        return this._Altura;
    }

    set peso(peso) {
        this._Peso = peso;
    }

    get peso() {
        return this._Peso;
    }

    set foto(foto) {
        this._foto = foto;
    }

    get foto() {
        return this.foto;
    }
}