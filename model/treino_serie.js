module.exports = class TreinoSerie {
    constructor(banco) {
        this._banco = banco;
        this._id = null;
        this._sessaoId = null;
        this._listaExercicioId = null;
        this._exercicioId = null;
        this._numeroSerie = 1;
        this._cargaKg = null;
        this._repsFeitas = null;
        this._concluida = 0;
        this._usuarioId = null;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._sessaoId, this._listaExercicioId, this._exercicioId, this._numeroSerie, this._cargaKg, this._repsFeitas];
            const sql = 'INSERT INTO treino_serie (sessao_id, lista_exercicio_id, exercicio_id, numero_serie, carga_kg, reps_feitas, concluida) VALUES (?,?,?,?,?,?,0);';
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

    async readBySessao() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._sessaoId];
            const sql = 'SELECT ts.*, e.nome AS nome_exercicio, e.musculo, e.imagem, e.instrucao, e.equipamento, le.series AS series_prescritas, le.reps AS reps_prescritas, le.carga_kg AS carga_prescrita, le.descanso_seg, le.ordem FROM treino_serie ts JOIN exercicios e ON e.idexercicio = ts.exercicio_id LEFT JOIN lista_exercicios le ON le.id = ts.lista_exercicio_id WHERE ts.sessao_id = ? ORDER BY le.ordem, ts.exercicio_id, ts.numero_serie;';
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

    async update() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._cargaKg, this._repsFeitas, this._concluida, this._concluida, this._id, this._sessaoId];
            const sql = 'UPDATE treino_serie SET carga_kg = ?, reps_feitas = ?, concluida = ?, concluida_em = IF(? = 1, NOW(), concluida_em) WHERE id = ? AND sessao_id = ?;';
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

    async historicoCarga() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId, this._exercicioId];
            const sql = "SELECT ts.carga_kg, ts.reps_feitas, ts.concluida_em, s.id AS sessao_id FROM treino_serie ts JOIN treino_sessao s ON s.id = ts.sessao_id WHERE s.usuario_id = ? AND ts.exercicio_id = ? AND ts.concluida = 1 AND ts.carga_kg IS NOT NULL ORDER BY ts.concluida_em DESC LIMIT 10;";
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

    set id(id) { this._id = id; }
    set sessaoId(sessaoId) { this._sessaoId = sessaoId; }
    set listaExercicioId(listaExercicioId) { this._listaExercicioId = listaExercicioId; }
    set exercicioId(exercicioId) { this._exercicioId = exercicioId; }
    set numeroSerie(numeroSerie) { this._numeroSerie = numeroSerie; }
    set cargaKg(cargaKg) { this._cargaKg = cargaKg; }
    set repsFeitas(repsFeitas) { this._repsFeitas = repsFeitas; }
    set concluida(concluida) { this._concluida = concluida; }
    set usuarioId(usuarioId) { this._usuarioId = usuarioId; }
};
