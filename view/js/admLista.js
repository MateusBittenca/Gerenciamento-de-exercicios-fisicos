

const obj = existeSessao();
const token = localStorage.getItem("token");
let listaExer_json = {};
let lista_json = {};
const txtFiltro = document.getElementById("txtFiltro");
const createLista = document.getElementById("Create-lista");


fecth_listaExer_get();
function fecth_listaExer_get() {

    const requisicao = fetch("listas/read", {
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
    });
}

function fecth_lista_post(novaLista) {
    const jsonLista = JSON.stringify(novaLista);
    const requisicao = fetch("/lista/create", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: jsonLista
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {

        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status === true) {
            Swal.fire({
                color: "white",
                background: "#1f2021",
                title: "Sucesso!",
                text: "Lista criada com sucesso!",
                icon: "success"
            });

        } else {
            Swal.fire({
                color: "white",
                background: "#1f2021",
                title: "Erro!",
                text: "Erro ao criar a lista!",
                icon: "error"
            });
        }
    }).catch((erro) => {
        console.log(erro);
    });
}
function fecth_lista_delete(idLista) {
    const requisicao = fetch("/lista/delete/" + idLista, {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
        } else {
            Swal.fire({
                color: "white",
                background: "#1f2021",
                title: "Erro ao excluir",
                text: "Alguma coisa deu errado",
                icon: "error"
            });
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function fecth_exercicios_deleteAll(idListaExer) {
    const requisicao = fetch("/lista/exercicios/deleteAll/" + idListaExer, {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fecth_listaExer_get();


        } else {
            alert("erro ao excluir");
        }
    })
}

function fecth_exercicios_delete(idListaExer, idExercicios) {
    const requisicao = fetch("lista/exercicios/delete/" + idListaExer + "/" + idExercicios, {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fecth_listaExer_get();
        } else {
            alert("erro ao excluir");
        }
    })
}

createLista.onclick = function () {
    const modalCreate = document.createElement("div");
    modalCreate.className = "modal";
    modalCreate.style.display = "block"; // Show the modal when created

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeModal = document.createElement("span");
    closeModal.className = "close-button";
    closeModal.innerHTML = "&times;";
    closeModal.onclick = function () {
        modalCreate.style.display = "none";
    };

    const text = document.createElement("h2");
    text.textContent = "Criar Lista";

    const inputNome = document.createElement("input");
    inputNome.placeholder = "Nome da Lista";

    const inputTipo = document.createElement("select");
    inputTipo.id = "txtTipo";
    inputTipo.required = true;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Tipo";
    inputTipo.appendChild(defaultOption);

    const optionA = document.createElement("option");
    optionA.value = "A";
    optionA.textContent = "A";
    inputTipo.appendChild(optionA);

    const optionB = document.createElement("option");
    optionB.value = "B";
    optionB.textContent = "B";
    inputTipo.appendChild(optionB);

    const optionC = document.createElement("option");
    optionC.value = "C";
    optionC.textContent = "C";
    inputTipo.appendChild(optionC);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerHTML = "Criar";
    submitButton.onclick = function () {
        const novaLista = {
            nome: inputNome.value,
            tipo: inputTipo.value

        };
        fecth_lista_post(novaLista)
        modalCreate.style.display = "none"; // Fecha o primeiro modal

    }

    modalContent.appendChild(closeModal);
    modalContent.appendChild(text);
    modalContent.appendChild(inputNome);
    modalContent.appendChild(inputTipo);
    modalContent.appendChild(submitButton);

    modalCreate.appendChild(modalContent);
    document.body.appendChild(modalCreate);
}

function limparTabela() {
    while (tabelaExercicios.firstChild) {
        tabelaExercicios.removeChild(tabelaExercicios.firstChild);
    }
}

function construirTabela() {
    limparTabela();


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
        const tabela = document.createElement("table");
        tabela.classList = "tabela-list";
        const linhaCabecalho = document.createElement("tr");
        const thNomeLista = document.createElement("th");
        thNomeLista.append(document.createTextNode(lista[0].nome_lista));
        linhaCabecalho.appendChild(thNomeLista);
        tabela.appendChild(linhaCabecalho);

        thNomeLista.addEventListener("click", () => {
            //alert("Você clicou no cabeçalho: " + lista[0].nome_lista);
            exibirModalExerciciosLista(lista);
        });

        // Adicionar exercícios à tabela
        for (const exercicio of lista) {
            const linha = document.createElement("tr");
            const colunaNomeExercicio = document.createElement("td");
            colunaNomeExercicio.append(document.createTextNode(exercicio.nome_exercicio));
            linha.appendChild(colunaNomeExercicio);
            tabela.appendChild(linha);

            // Adicionar evento de clique na linha
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
                musculoText.textContent = "Musculo: " + exercicio.musculo_trabalhado;

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
                modalContent.appendChild(br1)
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
        colunaMensagem.colSpan = 2;
        colunaMensagem.append(document.createTextNode("nenhuma lista encontrada!"));
        linha.appendChild(colunaMensagem);
        tabelaExercicios.appendChild(linha);
    }
}

function exibirModalExerciciosLista(lista) {
    const modalListaExercicios = document.createElement("div");
    modalListaExercicios.className = "modal-lista";
    modalListaExercicios.style.display = "none";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content-lista";

    const closeModal = document.createElement("span");
    closeModal.className = "close-button-lista";
    closeModal.innerHTML = "&times;";
    closeModal.onclick = function () {
        modalListaExercicios.style.display = "none";
    };

    const nomeListaContainer = document.createElement("div");
    nomeListaContainer.style.display = "flex";
    nomeListaContainer.style.alignItems = "center";

    const nomeLista = document.createElement("h2");
    nomeLista.textContent = lista[0].nome_lista;

    // Adicionar ícone de lixeira ao lado do nome da lista
    const iconeLixeira = document.createElement("i");
    iconeLixeira.className = "bi bi-trash-fill";
    iconeLixeira.style.cursor = "pointer";
    iconeLixeira.style.marginLeft = "10px";


    iconeLixeira.onclick = function () {
        Swal.fire({
            color: "white",
            background: "#1f2021",
            title: "Você tem certeza?",
            text: "Você não poderá reverter!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim!"
        }).then((result) => {
            if (result.isConfirmed) {
                const idLista = lista[0].id_lista;
                fecth_exercicios_deleteAll(idLista);
                fecth_lista_delete(idLista);
                modalListaExercicios.style.display = "none"
                Swal.fire({
                    color: "white",
                    background: "#1f2021",
                    title: "Excluida!",
                    text: "Sua lista de exercicio foi excluida.",
                    icon: "success"
                });
            }
        });

    };

    // Adicionar o nome e o ícone ao container
    nomeListaContainer.appendChild(nomeLista);
    nomeListaContainer.appendChild(iconeLixeira);

    const br = document.createElement("br");
    const br2 = document.createElement("br");

    modalContent.appendChild(closeModal);
    modalContent.appendChild(nomeListaContainer); // Usando o container com nome e ícone
    modalContent.appendChild(br);
    modalContent.appendChild(br2);

    // Criar uma tabela maior com os exercícios
    const tabelaModal = document.createElement("table");
    const linhaCabecalho = document.createElement("tr");

    const thNomeExercicio = document.createElement("th");
    thNomeExercicio.append(document.createTextNode("Nome do Exercício"));
    linhaCabecalho.appendChild(thNomeExercicio);

    const thMusculo = document.createElement("th");
    thMusculo.append(document.createTextNode("Músculo Trabalhado"));
    linhaCabecalho.appendChild(thMusculo);

    const thEquipamento = document.createElement("th");
    thEquipamento.append(document.createTextNode("Equipamento"));
    linhaCabecalho.appendChild(thEquipamento);

    const thDificuldade = document.createElement("th");
    thDificuldade.append(document.createTextNode("Dificuldade"));
    linhaCabecalho.appendChild(thDificuldade);

    const thAçao = document.createElement("th");
    thAçao.append(document.createTextNode("Ação"));
    linhaCabecalho.appendChild(thAçao);

    tabelaModal.appendChild(linhaCabecalho);

    // Adicionar os exercícios à tabela
    for (const exercicio of lista) {
        const linha = document.createElement("tr");

        const colunaNomeExercicio = document.createElement("td");
        colunaNomeExercicio.append(document.createTextNode(exercicio.nome_exercicio));

        const colunaMusculo = document.createElement("td");
        colunaMusculo.append(document.createTextNode(exercicio.musculo_trabalhado));

        const colunaEquipamento = document.createElement("td");
        colunaEquipamento.append(document.createTextNode(exercicio.equipamento));

        const colunaDificuldade = document.createElement("td");
        colunaDificuldade.append(document.createTextNode(exercicio.dificuldade));

        const colunaAçao = document.createElement("td");
        const botaoDelete = document.createElement("button");

        // Adicionar ícone de lixeira ao botão de remoção
        const iconeDelete = document.createElement("i");
        iconeDelete.className = "bi bi-trash3-fill";
        iconeDelete.style.cursor = "pointer";

        botaoDelete.appendChild(iconeDelete);

        botaoDelete.onclick = function () {
            const idLista = exercicio.id_lista;
            console.log(idLista)
            const idExer = exercicio.id_exercicio;
            console.log(idExer)
            fecth_exercicios_delete(idLista, idExer);
            linha.remove();
        };

        colunaAçao.append(botaoDelete);

        linha.appendChild(colunaNomeExercicio);
        linha.appendChild(colunaMusculo);
        linha.appendChild(colunaEquipamento);
        linha.appendChild(colunaDificuldade);
        linha.appendChild(colunaAçao);

        tabelaModal.appendChild(linha);
    }

    modalContent.appendChild(tabelaModal);
    modalListaExercicios.appendChild(modalContent);
    document.body.appendChild(modalListaExercicios);

    // Exibir o modal
    modalListaExercicios.style.display = "block";
}