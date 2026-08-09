const obj = existeSessao();
const usuarioId = obj.usuarioId;
const token = localStorage.getItem("token");
const URI = '/listas/read';
let listaExer_json = {};
const tabelaExercicios = document.getElementById("tabelaExercicios");

divUsuario.appendChild(document.createTextNode(obj.nome));

fecth_listaExer_get();

function fecth_listaExer_get() {

    const requisicao = fetch(URI, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
    });

    requisicao.then((response) => {
        return response.json();
    }).then((jsonTextoResposta) => {
        console.log(jsonTextoResposta);
        const obj = jsonTextoResposta;

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            listaExer_json = obj.dados;
            construirTabela();

        } else {
            alert("Login invalido!");
        }
    });

    requisicao.catch((erro) => {
        console.log(erro);
    })
}

function limparTabela() {
    while (tabelaExercicios.firstChild) {
        tabelaExercicios.removeChild(tabelaExercicios.firstChild);
    }
}

function construirTabela() {
    limparTabela();

    // Agrupar exercícios por tipo de treino
    const treinosAgrupados = listaExer_json.reduce((acc, exercicio) => {
        if (!acc[exercicio.id_lista]) {
            acc[exercicio.id_lista] = [];
        }
        acc[exercicio.id_lista].push(exercicio);
        return acc;
    }, {});

    // Criar uma tabela para cada tipo de treino
    for (const tipoLista in treinosAgrupados) {
        const lista = treinosAgrupados[tipoLista];

        // Criar um contêiner para a tabela
        const containerTabela = document.createElement("div");
        containerTabela.classList.add("container-tabela");

        // Criar o cabeçalho da tabela
        // Criar o cabeçalho da tabela
        const tabela = document.createElement("table");
        const linhaCabecalho = document.createElement("tr");
        const thNomeLista = document.createElement("th");

        thNomeLista.append(document.createTextNode(lista[0].nome_lista));

        // Adicionar evento de clique no cabeçalho
        thNomeLista.addEventListener("click", () => {
            alert("Você clicou no cabeçalho: " + lista[0].nome_lista);
        });

        linhaCabecalho.appendChild(thNomeLista);
        tabela.appendChild(linhaCabecalho);




        // Adicionar os exercícios à tabela
        for (const exercicio of lista) {
            const linha = document.createElement("tr");

            const colunaNomeExercicio = document.createElement("td");
            colunaNomeExercicio.append(document.createTextNode(exercicio.nome_exercicio));
            linha.appendChild(colunaNomeExercicio);

            // Adicionar evento de clique na linha para exibir o modal com detalhes
            linha.addEventListener("click", () => {
                const modalExercicio = document.createElement("div");
                modalExercicio.className = "modal";
                modalExercicio.style.display = "none";

                const modalContent = document.createElement("div");
                modalContent.className = "modal-content";

                const closeModal = document.createElement("span");
                closeModal.className = "close-button";
                closeModal.innerHTML = "&times;";
                closeModal.onclick = function () {
                    modalExercicio.style.display = "none";
                };

                const br1 = document.createElement("br");
                const br2 = document.createElement("br");
                const br3 = document.createElement("br");

                const nomeText = document.createElement("h2");
                nomeText.textContent = exercicio.nome_exercicio;

                const musculoText = document.createElement("h3");
                musculoText.textContent = "Músculo: " + exercicio.musculo_trabalhado;

                const equipamento = document.createElement("h3");
                equipamento.textContent = "Equipamento: " + exercicio.equipamento;

                const dificuldade = document.createElement("h3");
                dificuldade.textContent = "Dificuldade: " + exercicio.dificuldade;

                const tipo = document.createElement("h3");
                tipo.textContent = "Tipo: " + exercicio.tipo_exercicio;

                const imagem = document.createElement("img");
                imagem.src = exercicio.imagem;
                imagem.alt = "Imagem do exercício";

                const instrucao = document.createElement("h4");
                instrucao.textContent = exercicio.instrucao;

                modalContent.appendChild(closeModal);
                modalContent.appendChild(nomeText);
                modalContent.appendChild(br1);
                modalContent.appendChild(musculoText);
                modalContent.appendChild(equipamento);
                modalContent.appendChild(dificuldade);
                modalContent.appendChild(tipo);
                modalContent.appendChild(br2);
                modalContent.appendChild(imagem);
                modalContent.appendChild(br3);
                modalContent.appendChild(instrucao);

                modalExercicio.appendChild(modalContent);
                document.body.appendChild(modalExercicio);

                modalExercicio.style.display = "block";

            });

            tabela.appendChild(linha);
        }

        // Adicionar a tabela ao contêiner
        containerTabela.appendChild(tabela);
        tabelaExercicios.appendChild(containerTabela);
    }

    // Caso não existam exercícios na lista
    if (listaExer_json.length === 0) {
        const linha = document.createElement("tr");
        const colunaMensagem = document.createElement("td");
        colunaMensagem.append(document.createTextNode("Nenhuma lista encontrada!"));
        linha.appendChild(colunaMensagem);
        tabelaExercicios.appendChild(linha);
    }
}




