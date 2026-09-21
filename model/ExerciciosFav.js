module.exports = class ExerciciosFav {
    constructor(banco) {
        this._banco = banco;
        this._usuarioId = null;
        this._exercicioId = null;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId, this._exercicioId];
            const sql = 'INSERT INTO exercicios_favoritos (usuario_id, exercicio_id) VALUES (?,?) ON DUPLICATE KEY UPDATE created_at = created_at;';
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
            const sql = 'SELECT f.usuario_id, f.exercicio_id, f.created_at, e.nome, e.musculo, e.equipamento, e.dificuldade, e.instrucao, e.tipo, e.imagem, e.idexercicio FROM exercicios_favoritos f JOIN exercicios e ON e.idexercicio = f.exercicio_id WHERE f.usuario_id = ? ORDER BY f.created_at DESC;';
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
            const parametros = [this._usuarioId, this._exercicioId];
            const sql = 'DELETE FROM exercicios_favoritos WHERE usuario_id = ? AND exercicio_id = ?;';
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
    get usuarioId() { return this._usuarioId; }
    set exercicioId(exercicioId) { this._exercicioId = exercicioId; }
    get exercicioId() { return this._exercicioId; }
};
