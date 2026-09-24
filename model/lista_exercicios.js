module.exports = class Lista_exercicios {

    constructor(banco) {
        this._banco = banco;
        this._idLista = {
            idlista: null,
            usuario_UsuarioID: null
        };
        this._idexercicio = null;
        this._idLinha = null;
        this._ordem = 1;
        this._series = 3;
        this._reps = '10';
        this._cargaKg = null;
        this._descansoSeg = 60;
        this._observacao = null;
    }

    async create() {
        const operacao = new Promise((resolve, reject) => {
            const idLista = this._idLista;
            const idexercicio = this._idexercicio;
            const ordem = this._ordem || 1;
            const series = this._series || 3;
            const reps = this._reps || '10';
            const cargaKg = this._cargaKg;
            const descansoSeg = this._descansoSeg || 60;
            const observacao = this._observacao;

            const parametros = [idLista, idexercicio, ordem, series, reps, cargaKg, descansoSeg, observacao];

            const sql = "INSERT INTO lista_exercicios (lista_idlista,exercicios_idexercicio,ordem,series,reps,carga_kg,descanso_seg,observacao) VALUES (?,?,?,?,?,?,?,?);";
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

    async proximaOrdem() {
        const operacao = new Promise((resolve, reject) => {
            const idLista = typeof this._idLista === 'object' ? this._idLista.idlista : this._idLista;
            const sql = 'SELECT COALESCE(MAX(ordem), 0) + 1 AS ordem FROM lista_exercicios WHERE lista_idlista = ?';
            this._banco.query(sql, [idLista], function (erro, resultados) {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados[0].ordem);
                }
            });
        });
        return operacao;
    }

    async readListaIdDaLinha() {
        const operacao = new Promise((resolve, reject) => {
            const sql = 'SELECT lista_idlista FROM lista_exercicios WHERE id = ?';
            this._banco.query(sql, [this._idLinha], function (erro, resultados) {
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
            const idLinha = this._idLinha;
            const ordem = this._ordem;
            const series = this._series;
            const reps = this._reps;
            const cargaKg = this._cargaKg;
            const descansoSeg = this._descansoSeg;
            const observacao = this._observacao;

            const parametros = [ordem, series, reps, cargaKg, descansoSeg, observacao, idLinha];
            const sql = "UPDATE lista_exercicios SET ordem = ?, series = ?, reps = ?, carga_kg = ?, descanso_seg = ?, observacao = ? WHERE id = ?;";
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

    async readByListaId() {
        const operacao = new Promise((resolve, reject) => {
            const idLista = typeof this._idLista === 'object' ? this._idLista.idlista : this._idLista;
            const parametros = [idLista];
            const sql = "SELECT le.id AS id_lista_exercicio, le.lista_idlista AS id_lista, le.ordem, le.series, le.reps, le.carga_kg, le.descanso_seg, le.observacao, e.idexercicio AS id_exercicio, e.nome AS nome_exercicio, e.musculo AS musculo_trabalhado, e.equipamento, e.dificuldade, e.instrucao, e.tipo AS tipo_exercicio, e.imagem FROM lista_exercicios le JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio WHERE le.lista_idlista = ? ORDER BY le.ordem, le.id;";
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
            const usuarioId = this._idLista.usuario_UsuarioID;
            const parametros = [usuarioId];

            const sql = "SELECT l.idlista AS id_lista, l.nome AS nome_lista, l.tipo AS tipo_lista, l.objetivo, l.dias_semana, l.lista_origem_id, le.id AS id_lista_exercicio, le.ordem, le.series, le.reps, le.carga_kg, le.descanso_seg, le.observacao, e.idexercicio AS id_exercicio,e.nome AS nome_exercicio, e.musculo AS musculo_trabalhado, e.equipamento, e.dificuldade, e.instrucao, e.tipo AS tipo_exercicio, e.imagem, (SELECT ts.carga_kg FROM treino_serie ts JOIN treino_sessao s ON s.id = ts.sessao_id WHERE s.usuario_id = l.usuario_UsuarioID AND ts.exercicio_id = e.idexercicio AND ts.concluida = 1 AND ts.carga_kg IS NOT NULL ORDER BY ts.concluida_em DESC LIMIT 1) AS carga_atual FROM lista l LEFT JOIN lista_exercicios le ON l.idlista = le.lista_idlista LEFT JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio WHERE l.usuario_UsuarioID = ? ORDER BY l.idlista, le.ordem, le.id;";
           
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
            const sql = "SELECT l.idlista AS id_lista, l.nome AS nome_lista, l.tipo AS tipo_lista, l.objetivo, l.dias_semana, l.lista_origem_id, le.id AS id_lista_exercicio, le.ordem, le.series, le.reps, le.carga_kg, le.descanso_seg, le.observacao, e.idexercicio AS id_exercicio,e.nome AS nome_exercicio, e.musculo AS musculo_trabalhado, e.equipamento, e.dificuldade, e.instrucao, e.tipo AS tipo_exercicio, e.imagem FROM lista l LEFT JOIN lista_exercicios le ON l.idlista = le.lista_idlista LEFT JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio WHERE l.usuario_UsuarioID IS NULL ORDER BY l.idlista, le.ordem, le.id;";
            
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
            const idlista = this._idLista
            const idExercicio = this._idexercicio

            const parametros = [idlista, idExercicio];
            const sql = "DELETE FROM lista_exercicios WHERE lista_idlista = ? AND exercicios_idexercicio = ?; ";
            
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

    async deleteAll() {
        const operacao = new Promise((resolve, reject) => {
            const idlista = this._idLista

            const parametros = [idlista];

            const sql = "DELETE FROM lista_exercicios WHERE lista_idlista = ?; ";
            
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

    set banco(valor) {
        this._banco = valor;
    }

    get banco() {
        return this._banco;
    }

    set idListaExer(idListaExer) {
        this._idLista = idListaExer;
    }

    get idListaExer() {
        return this._idLista
    }

    set idExercicios(idExercicios) {
        this._idexercicio = idExercicios;
    }

    get idExercicios() {
        return this._idexercicio;
    }

    set usuario_UsuarioID(usuario_UsuarioID) {
        this._idLista.usuario_UsuarioID = usuario_UsuarioID;
    }

    get usuario_UsuarioID() {
        return this._idLista.usuario_UsuarioID;
    }

    set idLinha(idLinha) {
        this._idLinha = idLinha;
    }
    get idLinha() {
        return this._idLinha;
    }

    set ordem(ordem) {
        this._ordem = ordem;
    }
    get ordem() {
        return this._ordem;
    }

    set series(series) {
        this._series = series;
    }
    get series() {
        return this._series;
    }

    set reps(reps) {
        this._reps = reps;
    }
    get reps() {
        return this._reps;
    }

    set cargaKg(cargaKg) {
        this._cargaKg = cargaKg;
    }
    get cargaKg() {
        return this._cargaKg;
    }

    set descansoSeg(descansoSeg) {
        this._descansoSeg = descansoSeg;
    }
    get descansoSeg() {
        return this._descansoSeg;
    }

    set observacao(observacao) {
        this._observacao = observacao;
    }
    get observacao() {
        return this._observacao;
    }

}
