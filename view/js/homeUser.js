
const obj = existeSessao();
const cabeca = document.getElementById("cabeca")
const cabeca2 = document.getElementById("cabeca2")
const usuarioId = obj.usuarioId;
const token = localStorage.getItem("token");
let exercicios = {};
let listasSugeridas_json = {};
let minhaslistas_json = {};
const tblListSugerida = document.getElementById("tblListSugerida");
const tblMinhasListas = document.getElementById("tblMinhasListas")

const tblListSugeridaBody = tblListSugerida.querySelector("tbody") || tblListSugerida.appendChild(document.createElement("tbody"));
const tblMinhasListasBody = tblMinhasListas.querySelector("tbody") || tblMinhasListas.appendChild(document.createElement("tbody"));

const cardContainer = document.getElementById("card");
const cardContent = document.getElementById("card-content");
const btnVermais = document.getElementById("btnVermais");
divUsuario.append(document.createTextNode(obj.nome));


fetch_exerciciosFav_get();
fetch_MinhasListas_get();
fetch_exercicios_get();

cabeca.onclick = function(){
    window.location = "lista.html"
}

cabeca2.onclick = function(){
    window.location = "listasUsuario.html"
}

function fetch_exerciciosFav_get() {
    const requisicao = fetch("/lista", {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    });

    requisicao.then((response) => {
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            listasSugeridas_json = obj.dados;
            construirTabela();
        } else {
            alert("Login invalido!");
        }
    });
}

function fetch_MinhasListas_get() {
    const requisicao = fetch("/lista/" + usuarioId , {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    });

    requisicao.then((response) => {
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            minhaslistas_json = obj.dados;
            construirTabelaMinhasListas();
        } else {
            alert("Login invalido!");
        }
    });
}






function fetch_exercicios_get() {

    const requisicao = fetch("/exercicios", {
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

function limparTabela() {
    while (tblListSugeridaBody.firstChild) {
        tblListSugeridaBody.removeChild(tblListSugeridaBody.firstChild);
    }
}

function limparTabelaMinhasListas() {
    while (tblMinhasListasBody.firstChild) {
        tblMinhasListasBody.removeChild(tblMinhasListasBody.firstChild);
    }
}


function construirTabela() {
    limparTabela();
    if (listasSugeridas_json.length === 0) {
        const linha = document.createElement("tr");
        const colunaMensagem = document.createElement("td");
        colunaMensagem.colSpan = 3;
        colunaMensagem.append(document.createTextNode("Nenhuma lista recomendada"));
        linha.appendChild(colunaMensagem);
        tblListSugeridaBody.appendChild(linha);
    } else {
        for (let lista_sugerida of listasSugeridas_json) {
            const linha = document.createElement("tr");
            const colunaNome = document.createElement("td");
            const colunaTipo = document.createElement("td");

            colunaNome.append(document.createTextNode(lista_sugerida.nome));
        
            colunaTipo.append(document.createTextNode(lista_sugerida.tipo));

            linha.appendChild(colunaNome);
          
            linha.appendChild(colunaTipo);

            tblListSugeridaBody.appendChild(linha);
        }
    }
}

function construirTabelaMinhasListas(){
    limparTabelaMinhasListas();
    if (minhaslistas_json.length === 0) {
        const linha = document.createElement("tr");
        const colunaMensagem = document.createElement("td");
        colunaMensagem.colSpan = 3;
        colunaMensagem.append(document.createTextNode("Nenhuma lista personalizada"));
        linha.appendChild(colunaMensagem);
        tblMinhasListasBody.appendChild(linha);
    } else {
        for (let minhalista of minhaslistas_json) {
            const linha2 = document.createElement("tr");
            const colunaNome2 = document.createElement("td");
            const colunaTipo2 = document.createElement("td");

            colunaNome2.append(document.createTextNode(minhalista.nome));
        
            colunaTipo2.append(document.createTextNode(minhalista.tipo));

            linha2.appendChild(colunaNome2);
          
            linha2.appendChild(colunaTipo2);

            tblMinhasListasBody.appendChild(linha2);
        }
    }

}

function construirExercicios() {
    cardContainer.innerHTML = ''; // Limpa o conteúdo anterior dos cards

    if (exercicios.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum exercício encontrado.";
        cardContainer.appendChild(mensagem);
    } else {
        // Limitar para exibir apenas os dois primeiros exercícios
        const exerciciosParaExibir = exercicios_json.slice(0, 2);
        
        exerciciosParaExibir.forEach(exercicio => {
            // Criação do card
            const card = document.createElement("div");
            card.classList.add("card");
    
            const card_content = document.createElement("div");
            card_content.classList.add("card-content");
    
            const nome = document.createElement("h5");
            nome.textContent = exercicio.nome;
            card_content.appendChild(nome);
    
            const musculo = document.createElement("h5");
            musculo.textContent = "Musculo:" + exercicio.musculo;
            card_content.appendChild(musculo);
    
            if (exercicio.imagem) {
                const imagem = document.createElement("img");
                imagem.src = exercicio.imagem;
                imagem.alt = "Imagem do exercício";
                card_content.appendChild(imagem);
            }

            card.appendChild(card_content);
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
            modalContent.appendChild(imagem)
            modalContent.appendChild(br3)
            modalContent.appendChild(instrucao);
            
            modalExercicio.appendChild(modalContent);
            
            document.body.appendChild(modalExercicio);    
            
            card_content.onclick = function () {
                modalExercicio.style.display = "block";
            };
        });
    }
}

