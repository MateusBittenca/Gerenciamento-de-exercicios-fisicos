    module.exports = class Lista {

        constructor(banco) {
            this._banco = banco;
            this._idLista = null;
            this._nome = null;
            this._tipo = null;
            this._usuarioId = null;
            this._objetivo = 'hipertrofia';
            this._diasSemana = null;
            this._listaOrigemId = null;
        }

        static podeAlterar(linha, acesso) {
            if (!linha || !acesso) {
                return false;
            }
            if (linha.usuario_UsuarioID == null) {
                return acesso.admin === true;
            }
            return acesso.aluno === true && String(linha.usuario_UsuarioID) === String(acesso.usuarioId);
        }

        static podeTreinar(linha, acesso) {
            if (!linha || !acesso || acesso.aluno !== true) {
                return false;
            }
            if (linha.usuario_UsuarioID == null) {
                return true;
            }
            return String(linha.usuario_UsuarioID) === String(acesso.usuarioId);
        }

        async create() {
            const operacao = new Promise((resolve, reject) => {
                const nome = this._nome;
                const tipo = this._tipo;
                const usuarioId = this._usuarioId;
                const objetivo = this._objetivo || 'hipertrofia';
                const diasSemana = this._diasSemana;
                const listaOrigemId = this._listaOrigemId;

                const parametros = [nome, tipo, usuarioId, objetivo, diasSemana, listaOrigemId];

                const sql = "INSERT INTO lista (nome,tipo, usuario_UsuarioID, objetivo, dias_semana, lista_origem_id) VALUES (?,?,?,?,?,?);";
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

        async readById() {
            const operacao = new Promise((resolve, reject) => {
                const idLista = this._idLista;
                const parametros = [idLista];
                const sql = 'SELECT * FROM lista WHERE idlista = ?';

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

        async readOrigemDoUsuario() {
            const operacao = new Promise((resolve, reject) => {
                const usuarioId = this._usuarioId;
                const origemId = this._listaOrigemId;
                const parametros = [usuarioId, origemId];
                const sql = 'SELECT * FROM lista WHERE usuario_UsuarioID = ? AND lista_origem_id = ?';

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
                const objetivo = this._objetivo;
                const diasSemana = this._diasSemana;

                const parametros = [nome, tipo, objetivo, diasSemana, idLista];
                const sql = 'UPDATE lista SET nome = ?, tipo =?, objetivo = ?, dias_semana = ? WHERE idlista = ?;';

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

        set objetivo(objetivo) {
            this._objetivo = objetivo;
        }
        get objetivo() {
            return this._objetivo;
        }

        set diasSemana(diasSemana) {
            this._diasSemana = diasSemana;
        }
        get diasSemana() {
            return this._diasSemana;
        }

        set listaOrigemId(listaOrigemId) {
            this._listaOrigemId = listaOrigemId;
        }
        get listaOrigemId() {
            return this._listaOrigemId;
        }
    }
