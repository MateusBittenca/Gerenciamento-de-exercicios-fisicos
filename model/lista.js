    module.exports = class Lista {

        constructor(banco) {
            this._banco = banco;
            this._idLista = null;
            this._nome = null;
            this._tipo = null;
            this._usuarioId = null;
        }

        async create() {
            const operacao = new Promise((resolve, reject) => {
                const idLista = this._idLista;
                const nome = this._nome;
                const tipo = this._tipo;
                const usuarioId = this._usuarioId;

                const parametros = [idLista, nome, tipo, usuarioId];

                const sql = "INSERT INTO lista (idlista,nome,tipo, usuario_UsuarioID) VALUES (?,?,?,?);";
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

        async read() {
            const operacao = new Promise((resolve, reject) => {
                const usuarioId = this._usuarioId;
                const parametros = [usuarioId];
                const sql = 'SELECT * FROM lista WHERE usuario_UsuarioID = ?';

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
        
        async readAll() {
            const operacao = new Promise((resolve, reject) => {
              
                const parametros = [];
                const sql = 'SELECT * FROM lista WHERE usuario_UsuarioID IS NULL';

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
                const idLista = this._idLista;
                const nome = this._nome;
                const tipo = this._tipo;

                const parametros = [nome, tipo, idLista];
                const sql = 'UPDATE lista SET nome = ?, tipo =? WHERE idlista = ?;';

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
                const idLista = this._idLista;
                const parametros = [idLista];

                const sql = "DELETE FROM lista WHERE idlista = ?;";
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

        set banco(valor) {
            this._banco = valor;
        }
        get banco() {
            return this._banco;
        }

        set idLista(idLista) {
            this._idLista = idLista;
        }

        get idLista() {
            return this._idLista;
        }

        set nome(nome) {
            this._nome = nome;
        }

        get nome() {
            return this._nome;
        }

        set tipo(tipo) {
            this._tipo = tipo;
        }

        get tipo() {
            return this._tipo;
        }

        set usuarioId(usuarioId){
            this._usuarioId = usuarioId;
        }
        get usuarioId(){
            return this._usuarioId;
        }
    }