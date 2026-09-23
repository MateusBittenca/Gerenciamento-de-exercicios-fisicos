module.exports = class TreinoSessao {
    constructor(banco) {
        this._banco = banco;
        this._id = null;
        this._usuarioId = null;
        this._listaId = null;
        this._status = 'em_andamento';
        this._duracaoSeg = null;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId, this._listaId];
            const sql = "INSERT INTO treino_sessao (usuario_id, lista_id, status) VALUES (?,?, 'em_andamento');";
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

    async readAtiva() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId];
            const sql = "SELECT * FROM treino_sessao WHERE usuario_id = ? AND status = 'em_andamento' ORDER BY iniciada_em DESC LIMIT 1;";
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

    async readById() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._id];
            const sql = 'SELECT s.*, l.nome AS nome_lista, l.tipo AS tipo_lista, l.objetivo, l.dias_semana FROM treino_sessao s JOIN lista l ON l.idlista = s.lista_id WHERE s.id = ?;';
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

    async contarConcluidasMes() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId];
            const sql = "SELECT COUNT(*) AS qtd FROM treino_sessao WHERE usuario_id = ? AND status = 'concluida' AND MONTH(encerrada_em) = MONTH(NOW()) AND YEAR(encerrada_em) = YEAR(NOW());";
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

    async encerrar() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._status, this._duracaoSeg, this._id, this._usuarioId];
            const sql = 'UPDATE treino_sessao SET status = ?, encerrada_em = NOW(), duracao_seg = ? WHERE id = ? AND usuario_id = ?;';
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

    async diasTreinados(ano, mes) {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId, ano, mes];
            const sql = `SELECT DATE_FORMAT(encerrada_em, '%Y-%m-%d') AS dia
                         FROM treino_sessao
                         WHERE usuario_id = ?
                           AND status = 'concluida'
                           AND YEAR(encerrada_em) = ?
                           AND MONTH(encerrada_em) = ?
                         GROUP BY dia
                         ORDER BY dia;`;
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados.map(r => r.dia));
                }
            });
        });
        return operacao;
    }

    async contarTotal() {
        const operacao = new Promise((resolve, reject) => {
            const parametros = [this._usuarioId];
            const sql = "SELECT COUNT(*) AS qtd FROM treino_sessao WHERE usuario_id = ? AND status = 'concluida';";
            this._banco.query(sql, parametros, function (erro, resultados) {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados[0] ? resultados[0].qtd : 0);
                }
            });
        });
        return operacao;
    }

    set id(id) { this._id = id; }
    get id() { return this._id; }
    set usuarioId(usuarioId) { this._usuarioId = usuarioId; }
    set listaId(listaId) { this._listaId = listaId; }
    set status(status) { this._status = status; }
    set duracaoSeg(duracaoSeg) { this._duracaoSeg = duracaoSeg; }
};
