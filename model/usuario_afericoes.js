module.exports = class UsuarioAfericoes {
    constructor(banco) {
        this._banco = banco;
        this._usuarioId = null;
        this._peso = null;
        this._altura = null;
        this._imc = null;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId, this._peso, this._altura, this._imc];
            const sql = 'INSERT INTO usuario_afericoes (usuario_id, peso, altura, imc) VALUES (?,?,?,?);';
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

    async read() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId];
            const sql = 'SELECT * FROM usuario_afericoes WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 20;';
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

    set usuarioId(usuarioId) { this._usuarioId = usuarioId; }
    set peso(peso) { this._peso = peso; }
    set altura(altura) { this._altura = altura; }
    set imc(imc) { this._imc = imc; }
};
