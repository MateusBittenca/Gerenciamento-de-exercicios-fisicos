module.exports = class Lista_exercicios { // Define e exporta uma classe chamada Lista_exercicios

    constructor(banco) { // Construtor que recebe uma conexão com o banco de dados
        this._banco = banco; // Armazena a conexão com o banco
        this._idLista = { // Inicializa o objeto _idLista com os atributos idlista e usuario_UsuarioID
            idlista: null,
            usuario_UsuarioID: null
        };
        this._idexercicio = null; // Inicializa o _idexercicio com null

    }

    async create() { // Método assíncrono para criar uma nova entrada na tabela lista_exercicios
        const operacao = new Promise((resolve, reject) => { // Retorna uma nova Promise para operação assíncrona

            const idLista = this._idLista; // Captura o valor de _idLista
            const idexercicio = this._idexercicio; // Captura o valor de _idexercicio

            const parametros = [idLista, idexercicio]; // Cria um array com os parâmetros para o SQL

            const sql = "INSERT INTO lista_exercicios (lista_idlista,exercicios_idexercicio) VALUES (?,?);"; // Query SQL para inserir dados na tabela lista_exercicios
            this._banco.query(sql, parametros, function (erro, resultados) { // Executa a query SQL com os parâmetros
                if (erro) { // Se ocorrer erro, rejeita a Promise
                    console.log(erro); // Log do erro
                    reject(erro); // Rejeita a Promise
                } else {
                    resolve(resultados); // Se sucesso, resolve a Promise com os resultados
                }
            });
        });
        return operacao; // Retorna a Promise
    }

    async read() { // Método assíncrono para buscar dados de listas e exercícios de um usuário específico
        const operacao = new Promise((resolve, reject) => { // Retorna uma nova Promise

            const usuarioId = this._idLista.usuario_UsuarioID; // Captura o id do usuário da lista
            const parametros = [usuarioId]; // Define os parâmetros para o SQL

            const sql = "SELECT l.idlista AS id_lista, l.nome AS nome_lista, l.tipo AS tipo_lista, e.idexercicio AS id_exercicio,e.nome AS nome_exercicio, e.musculo AS musculo_trabalhado, e.equipamento, e.dificuldade, e.instrucao, e.tipo AS tipo_exercicio, e.imagem FROM lista l JOIN lista_exercicios le ON l.idlista = le.lista_idlista JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio WHERE l.usuario_UsuarioID = ?;"; // SQL para buscar listas e exercícios de um usuário
           
            this._banco.query(sql, parametros, function (erro, resultados) { // Executa a query com os parâmetros
                if (erro) { // Se erro, rejeita a Promise
                    console.log(erro); // Log do erro
                    reject(erro); // Rejeita a Promise
                } else {
                    resolve(resultados); // Se sucesso, resolve a Promise com os resultados
                };
            });
        });
        return operacao; // Retorna a Promise
    }

    async readAll() { // Método assíncrono para buscar todas as listas e exercícios sem usuário específico
        const operacao = new Promise((resolve, reject) => { // Retorna uma nova Promise

            const parametros = []; // Não precisa de parâmetros
            const sql = "SELECT l.idlista AS id_lista, l.nome AS nome_lista, l.tipo AS tipo_lista, e.idexercicio AS id_exercicio,e.nome AS nome_exercicio, e.musculo AS musculo_trabalhado, e.equipamento, e.dificuldade, e.instrucao, e.tipo AS tipo_exercicio, e.imagem FROM lista l JOIN lista_exercicios le ON l.idlista = le.lista_idlista JOIN exercicios e ON le.exercicios_idexercicio = e.idexercicio WHERE l.usuario_UsuarioID IS NULL ;"; // SQL para buscar todas as listas sem usuário específico
            
            this._banco.query(sql, parametros, function (erro, resultados) { // Executa a query
                if (erro) { // Se erro, rejeita a Promise
                    console.log(erro); // Log do erro
                    reject(erro); // Rejeita a Promise
                } else {
                    resolve(resultados); // Se sucesso, resolve a Promise
                }
            });
        });
        return operacao; // Retorna a Promise
    }

    async delete() { // Método assíncrono para deletar uma relação específica entre lista e exercício
        const operacao = new Promise((resolve, reject) => { // Retorna uma nova Promise
            const idlista = this._idLista // Captura o id da lista
            const idExercicio = this._idexercicio // Captura o id do exercício

            const parametros = [idlista, idExercicio]; // Define os parâmetros para o SQL
            const sql = "DELETE FROM lista_exercicios WHERE lista_idlista = ? AND exercicios_idexercicio = ?; "; // SQL para deletar uma entrada específica
            
            this._banco.query(sql, parametros, function (erro, resultados) { // Executa a query
                if (erro) { // Se erro, rejeita a Promise
                    console.log(erro); // Log do erro
                    reject(erro); // Rejeita a Promise
                } else {
                    resolve(resultados); // Se sucesso, resolve a Promise
                }
            });
        });
        return operacao; // Retorna a Promise
    }

    async deleteAll() { // Método assíncrono para deletar todas as relações de uma lista
        const operacao = new Promise((resolve, reject) => { // Retorna uma nova Promise
            const idlista = this._idLista // Captura o id da lista

            const parametros = [idlista]; // Define os parâmetros para o SQL

            const sql = "DELETE FROM lista_exercicios WHERE lista_idlista = ?; "; // SQL para deletar todas as entradas da lista
            
            this._banco.query(sql, parametros, function (erro, resultados) { // Executa a query
                if (erro) { // Se erro, rejeita a Promise
                    console.log(erro); // Log do erro
                    reject(erro); // Rejeita a Promise
                } else {
                    resolve(resultados); // Se sucesso, resolve a Promise
                }
            });

        });
        return operacao; // Retorna a Promise
    }

    // Métodos getters e setters para encapsular e acessar as propriedades da classe

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

}
