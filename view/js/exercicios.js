const obj = existeSessao();
const usuarioId = obj.usuarioId;
const token = localStorage.getItem("token");
const URI = "/exercicios";
let exercicios_json = {};
let listas_json = {};
const divUsuario = document.getElementById("divUsuario");
const btnBiceps = document.getElementById("biceps");
const btnTriceps = document.getElementById("triceps");
const btnPeito = document.getElementById("peito");
const btnCostas = document.getElementById("costas");
const btnQuadriceps = document.getElementById("quadriceps");
const btnOmbro = document.getElementById("ombro");
const btnTodos = document.getElementById("todos");
const cardContainer = document.getElementById("card");
const busca = document.getElementById("busca");
const cardContent = document.getElementById("card-content");
const acoes = document.getElementById("acoes");


busca.onkeyup = filtroTexto;

divUsuario.append(document.createTextNode(obj.nome));

//evento clique do filtro!!!
btnBiceps.addEventListener("click", () => construirExercicios("Bíceps"));
btnTriceps.addEventListener("click", () => construirExercicios("Tríceps"));
btnPeito.addEventListener("click", () => construirExercicios("Peito"));
btnOmbro.addEventListener("click", () => construirExercicios("Ombro"));
btnQuadriceps.addEventListener("click", () => construirExercicios("Quadríceps"));
btnCostas.addEventListener("click", () => construirExercicios("Costas"));
btnTodos.addEventListener("click", () => construirExercicios(""));

fetch_exercicios_get();

function fetch_listaExercicios_post(novaListaExer) {
    const jsonListaExer = JSON.stringify(novaListaExer);
    const requisicao = fetch("lista/exercicios/create", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: jsonListaExer
    });
    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {

        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status === true) {
            localStorage.setItem("token", obj.token);
            Swal.fire({
                color: "white",
                background: "#1f2021",
                title: "Sucesso!",
                text: "Exercicio adionado a lista!",
                icon: "success"
              });

        } else {
            Swal.fire({
                color: "white",
                background: "#1f2021",
                title: "Erro!",
                text: "Erro ao adicionar exercicio na lista!",
                icon: "errro"
              });
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function fetch_lista_get(table, idExercicio) { 
    fetch("/lista/" + usuarioId, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
    .then((response) => {
        return response.json();
    })
    .then((jsonTextoResposta) => {
        const obj = jsonTextoResposta;

        if (obj.status == true) {
            const listas = obj.dados;

            listas.forEach((lista) => {
                const row = document.createElement("tr");

                const exercicio = document.createElement("td");
                exercicio.textContent = lista.nome;
                row.appendChild(exercicio);

                const tipo = document.createElement("td");
                tipo.textContent = lista.tipo;
                row.appendChild(tipo);

                
                row.onclick = function () {
                    const novaListaExer = {
                        idListaExer: lista.idlista,  
                        idExercicios: idExercicio  
                    };
                    fetch_listaExercicios_post(novaListaExer);
                    

                };

                table.appendChild(row);
            });
        } else {
            alert("Erro ao buscar as listas.");
        }
    })
    .catch((error) => {
        console.error("Erro ao buscar as listas:", error);
    });
}


function fetch_exercicios_get() {

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

        const obj = jsonTextoResposta;

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            exercicios_json = obj.dados;
            construirExercicios();
        } else {
            divResposta.append(document.createTextNode("Login inválido"));
        }
    });

    requisicao.catch((erro) => {
        console.log(erro);
    });
}
function construirExercicios(filtro) {
    cardContainer.innerHTML = "";

    const exerciciosAFiltrar = filtro ? exercicios_json.filter(exercicio => exercicio.musculo === filtro) : exercicios_json;

    if (exerciciosAFiltrar.length === 0) {
        console.log("Nenhum exercício encontrado para o músculo selecionado.");
        return;
    }

    exerciciosAFiltrar.forEach((exercicio) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const card_content = document.createElement("div");
        card_content.classList.add("card-content");

        const nome = document.createElement("h3");
        nome.textContent = exercicio.nome;
        card_content.appendChild(nome);


        const musculo = document.createElement("p");
        musculo.textContent = "Musculo:" + exercicio.musculo;
        card_content.appendChild(musculo);

        if (exercicio.imagem) {
            const imagem = document.createElement("img");
            imagem.src = exercicio.imagem;
            imagem.alt = "Imagem do exercício";
            card_content.appendChild(imagem);
        }

        const plusIcon = document.createElement("i");
        plusIcon.setAttribute("class", "bi bi-plus-lg");


        const bookmarkLabel = document.createElement("label");
        bookmarkLabel.classList.add("ui-bookmark");

        const bookmarkInput = document.createElement("input");
        bookmarkInput.type = "checkbox";

        const bookmarkDiv = document.createElement("div");
        bookmarkDiv.classList.add("bookmark");


        bookmarkDiv.appendChild(plusIcon);

        bookmarkLabel.appendChild(bookmarkDiv);

        bookmarkLabel.onclick = function () {
            // Captura o ID do exercício que está sendo adicionado
            const idExercicio = exercicio.idexercicio; // Assumindo que cada exercício tem um campo `id`

            const modalCreate = document.createElement("div");
            modalCreate.className = "modal";
            modalCreate.style.display = "block";

            const modalContent = document.createElement("div");
            modalContent.className = "modal-content";

            const closeModal = document.createElement("span");
            closeModal.className = "close-button";
            closeModal.innerHTML = "&times;";
            closeModal.onclick = function () {
                modalCreate.style.display = "none";
            };

            const text = document.createElement("h2");
            text.textContent = "Listas de Exercícios";

            // Criando a tabela
            const table = document.createElement("table");
            table.className = "exercise-table";

            // Cabeçalho da tabela
            const headerRow = document.createElement("tr");

            const header1 = document.createElement("th");
            header1.textContent = "Lista";  // Cabeçalho "Lista"
            const header2 = document.createElement("th");
            header2.textContent = "Tipo";  // Cabeçalho "Tipo"

            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            table.appendChild(headerRow);

            // Adiciona a tabela ao modal
            modalContent.appendChild(closeModal);
            modalContent.appendChild(text);
            modalContent.appendChild(table);
            modalCreate.appendChild(modalContent);
            document.body.appendChild(modalCreate);

            // Chama a função para buscar as listas e preencher a tabela, passando o ID do exercício
            fetch_lista_get(table, idExercicio);  // Passa a tabela e o ID do exercício como argumento para a função
        };


        card.appendChild(card_content)
        card.appendChild(bookmarkLabel);
        cardContainer.appendChild(card);

        //MODAL EXERCICIOS

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
        nomeText.textContent = exercicio.nome;

        const musculoText = document.createElement("h3");
        musculoText.textContent = "Musculo: " + exercicio.musculo;

        const equipamento = document.createElement("h3");
        equipamento.textContent = "Equipamento: " + exercicio.equipamento;

        const dificuldade = document.createElement("h3");
        dificuldade.textContent = "Dificuldade: " + exercicio.dificuldade;

        const tipo = document.createElement("h3");
        tipo.textContent = "Tipo: " + exercicio.tipo;

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
        modalContent.appendChild(imagem)
        modalContent.appendChild(br3)
        modalContent.appendChild(instrucao);

        modalExercicio.appendChild(modalContent);
        document.body.appendChild(modalExercicio);

        // Evento de clique no card_content
        card_content.onclick = function () {
            modalExercicio.style.display = "block";
        };
    });
}


function filtroTexto() {
    const textoBusca = busca.value.toLowerCase();
    cardContainer.innerHTML = "";

    for (let exercicio of exercicios_json) {
        let nome = exercicio.nome.toLowerCase();
        if (textoBusca && nome.includes(textoBusca)) {

            const card = document.createElement("div");
            card.classList.add("card");

            const card_content = document.createElement("div");
            card_content.classList.add("card-content");

            const nome = document.createElement("h3");
            nome.textContent = exercicio.nome;
            card_content.appendChild(nome);

            const musculo = document.createElement("p");
            musculo.textContent = "Musculo:" + exercicio.musculo;
            card_content.appendChild(musculo);

            if (exercicio.imagem) {
                const imagem = document.createElement("img");
                imagem.src = exercicio.imagem;
                imagem.alt = "Imagem do exercício";
                card_content.appendChild(imagem);
            }

            const plusIcon = document.createElement("i");
            plusIcon.setAttribute("class", "bi bi-plus-lg");

            const bookmarkLabel = document.createElement("label");
            bookmarkLabel.classList.add("ui-bookmark");

            const bookmarkInput = document.createElement("input");
            bookmarkInput.type = "checkbox";

            const bookmarkDiv = document.createElement("div");
            bookmarkDiv.classList.add("bookmark");



            bookmarkDiv.appendChild(plusIcon);

            bookmarkLabel.appendChild(bookmarkDiv);

            card.appendChild(card_content)
            card.appendChild(bookmarkLabel);
            cardContainer.appendChild(card);



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
            nomeText.textContent = exercicio.nome;

            const musculoText = document.createElement("h3");
            musculoText.textContent = "Musculo: " + exercicio.musculo;

            const equipamento = document.createElement("h3");
            equipamento.textContent = "Equipamento: " + exercicio.equipamento;

            const dificuldade = document.createElement("h3");
            dificuldade.textContent = "Dificuldade: " + exercicio.dificuldade;

            const tipo = document.createElement("h3");
            tipo.textContent = "Tipo: " + exercicio.tipo;

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

            // Evento de clique no card_content
            card_content.onclick = function () {
                modalExercicio.style.display = "block";
            };

            cardContainer.appendChild(card);
        }
    }
}

