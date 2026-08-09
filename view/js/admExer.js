
const obj = existeSessao();
const URI = "/exercicios";
const token = localStorage.getItem("token");
let exercicios_json = {};
const txtFiltro = document.getElementById("txtFiltro");
const tblExercicios = document.getElementById("tblExercicios");
const createExer = document.getElementById("Create-exer");
let caminho = "../ExerciciosGif/";

fetch_exercicios_get();

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
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {

            localStorage.setItem("token", obj.token);
            exercicios_json = obj.dados;
            construirTabela();

        } else {
            alert("Login invalido!");
        }
    });
}

function fecth_exercicios_post(novoExercicio) {
    const jsonExercicio = JSON.stringify(novoExercicio);
    const requisicao = fetch(URI, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
        body: jsonExercicio
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fetch_exercicios_get();
            Swal.fire({
                color:"white",
                background : "#1f2021",
                title: "Sucesso!",
                text: "Exercicio criado com sucesso!",
                icon: "success"
            });


        } else {
            alert("login invalido");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function fecth_exercicios_update(novoExercicio, exercicioId) {
    const jsonExercicio = JSON.stringify(novoExercicio);
    const rota = URI + "/" + exercicioId;
    const requisicao = fetch(rota, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
        body: jsonExercicio
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fetch_exercicios_get();
            Swal.fire({
                color:"white",
                background : "#1f2021",
                title: "Sucesso!",
                text: "Exercicio editado com sucesso!",
                icon: "success"
            });

        } else {
            alert("login Invalido!");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function fetch_exercicios_delete(exercicioId) {
    const rota = URI + "/" + exercicioId;
    const requisicao = fetch(rota, {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fetch_exercicios_get();
        } else {
            alert("Login invalido");
        }
    }).catch((erro) => {
        console.log(erro);

    });
}



//Area de criação da tabela!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function limparTabela() {
    let qtdLinhas = tblExercicios.rows.length;
    for (let i = qtdLinhas - 1; i > 0; i--) {
        tblExercicios.deleteRow(i);
    }
}





function construirTabela(filtro = null) {
    limparTabela();
    for (let exercicio of exercicios_json) {
        if (filtro != null) {
            let nomeExercicio = exercicio.nome.toLowerCase();
            filtro = filtro.toLowerCase();
            if (!nomeExercicio.includes(filtro)) {
                continue;
            }
        }

        const linha = document.createElement("tr");
        const colunaId = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaMusculo = document.createElement("td");
        const colunaEquipamento = document.createElement("td");
        const colunaDificuldade = document.createElement("td");
        const colunaInstrucao = document.createElement("td");
        const colunaTipo = document.createElement("td");
        const colunaImagem = document.createElement("td");
        const colunaExcluir = document.createElement('td');
        const colunaEditar = document.createElement('td');



        const modalInstrucao = document.createElement("div");
        modalInstrucao.className = "modal";
        modalInstrucao.style.display = "none";


        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";


        const closeModal = document.createElement("span");
        closeModal.className = "close-button";
        closeModal.innerHTML = "&times;";
        closeModal.onclick = function () {
            modalInstrucao.style.display = "none";
        };


        const modalButton = document.createElement("button");
        modalButton.textContent = "Editar";
        modalButton.className = "button-modal";
        modalButton.onclick = function () {


            const inputBox = document.createElement("textarea");
            inputBox.type = "text";
            inputBox.value = instrucaoText.textContent;
            modalContent.replaceChild(inputBox, instrucaoText);

            modalButton.style.display = "none";



            // Cria o botão de salvar
            const saveButton = document.createElement("button");
            saveButton.textContent = "Salvar";
            saveButton.className = "button-save";
            saveButton.onclick = function () {
                // Atualiza o texto com o valor do input box
                instrucaoText.textContent = inputBox.value;
                modalContent.replaceChild(instrucaoText, inputBox);
                modalContent.removeChild(saveButton);

                modalButton.style.display = "inline-block";

                const novoExercicio = {
                    nome: exercicio.nome,
                    musculo: exercicio.musculo,
                    equipamento: exercicio.equipamento,
                    dificuldade: exercicio.dificuldade,
                    instrucao: inputBox.value,
                    tipo: exercicio.tipo,
                    imagem: exercicio.imagem
                };
                fecth_exercicios_update(novoExercicio, exercicio.idexercicio);
            };


            modalContent.appendChild(saveButton);
        };
        const instrucaoText = document.createElement("p");
        instrucaoText.textContent = exercicio.instrucao;
        modalContent.appendChild(closeModal);
        modalContent.appendChild(instrucaoText);
        modalContent.appendChild(modalButton);
        modalInstrucao.appendChild(modalContent);
        document.body.appendChild(modalInstrucao);

        const btnInstrucao = document.createElement("button");
        btnInstrucao.className = "btn-instrucao";
        btnInstrucao.append(document.createTextNode("Ver Instrução"));
        btnInstrucao.onclick = function () {
            modalInstrucao.style.display = "block";
        };

        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn-excluir";
        btnExcluir.append(document.createTextNode("Excluir"));
        btnExcluir.onclick = function () {
            const id = exercicio.idexercicio;
            Swal.fire({
                title: "Você tem certeza?",
                text: "Você não poderá reverter a sua escolha!",
                icon: "warning",
                showCancelButton: true,
                color: "white",
                background: "#1f2021",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar!",
                confirmButtonText: "Sim!"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch_exercicios_delete(id);
                    Swal.fire({
                        color: "white",
                        background: "#1f2021",
                        title: "Excluido!",
                        text: "Exercicio excluido!.",
                        icon: "success"
                    });
                }
            });
        };

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn-editar";
        btnEditar.append(document.createTextNode("Editar"));
        btnEditar.onclick = function () {
            editarLinha(linha, exercicio);
        };

        colunaId.append(document.createTextNode(exercicio.idexercicio));
        colunaNome.append(document.createTextNode(exercicio.nome));
        colunaMusculo.append(document.createTextNode(exercicio.musculo));
        colunaEquipamento.append(document.createTextNode(exercicio.equipamento));
        colunaDificuldade.append(document.createTextNode(exercicio.dificuldade));
        colunaInstrucao.append(btnInstrucao)
        colunaTipo.append(document.createTextNode(exercicio.tipo));
        colunaImagem.append(document.createTextNode(exercicio.imagem));
        colunaExcluir.append(btnExcluir);
        colunaEditar.append(btnEditar);

        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaMusculo);
        linha.appendChild(colunaEquipamento)
        linha.appendChild(colunaDificuldade);
        linha.appendChild(colunaInstrucao);
        linha.appendChild(colunaTipo);
        linha.appendChild(colunaImagem);
        linha.appendChild(colunaExcluir);
        linha.appendChild(colunaEditar);

        tblExercicios.appendChild(linha);
    }
}


function editarLinha(linha, exercicio) {
    linha.innerHTML = "";

    const colunaId = document.createElement("td");
    const colunaNome = document.createElement("td");
    const colunaMusculo = document.createElement("td");
    const colunaEquipamento = document.createElement("td");
    const colunaDificuldade = document.createElement("td");
    const colunaTipo = document.createElement("td");
    const colunaImagem = document.createElement("td");
    const colunaSalvar = document.createElement("td");

    colunaId.append(document.createTextNode(exercicio.idexercicio));
    const exercicioid = exercicio.idexercicio;

    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = exercicio.nome;
    colunaNome.appendChild(inputNome);

    const inputMusculo = document.createElement("select");
    inputMusculo.id = "txtMusculo";
    inputMusculo.required = true;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Musculo";
    inputMusculo.appendChild(defaultOption);

    const optionBiceps = document.createElement("option");
    optionBiceps.value = "Bíceps";
    optionBiceps.textContent = "Bíceps";
    inputMusculo.appendChild(optionBiceps);

    const optionTriceps = document.createElement("option");
    optionTriceps.value = "Tríceps";
    optionTriceps.textContent = "Tríceps";
    inputMusculo.appendChild(optionTriceps);

    const optionPeito = document.createElement("option");
    optionPeito.value = "Peito";
    optionPeito.textContent = "Peito";
    inputMusculo.appendChild(optionPeito);

    const optionCostas = document.createElement("option");
    optionCostas.value = "Costas";
    optionCostas.textContent = "Costas";
    inputMusculo.appendChild(optionCostas);

    const optionOmbro = document.createElement("option");
    optionOmbro.value = "Ombro";
    optionOmbro.textContent = "Ombro";
    inputMusculo.appendChild(optionOmbro);

    const optionQuadriceps = document.createElement("option");
    optionQuadriceps.value = "Quadríceps";
    optionQuadriceps.textContent = "Quadríceps";
    inputMusculo.appendChild(optionQuadriceps);

    colunaMusculo.appendChild(inputMusculo);

    const inputEquipamento = document.createElement("input");
    inputEquipamento.type = "text";
    inputEquipamento.value = exercicio.equipamento || '';
    colunaEquipamento.appendChild(inputEquipamento);

    const inputDificuldade = document.createElement("select");
    inputDificuldade.id = "txtDificuldade";
    inputDificuldade.required = true;

    const defaultOption2 = document.createElement("option");
    defaultOption2.value = "";
    defaultOption2.disabled = true;
    defaultOption2.selected = true;
    defaultOption2.textContent = "Dificuldade";
    inputDificuldade.appendChild(defaultOption2);

    const optionIniciante = document.createElement("option");
    optionIniciante.value = "Iniciante";
    optionIniciante.textContent = "Iniciante";
    inputDificuldade.appendChild(optionIniciante);

    const optionIntermediario = document.createElement("option");
    optionIntermediario.value = "Intermediário";
    optionIntermediario.textContent = "Intermediário";
    inputDificuldade.appendChild(optionIntermediario);

    const optionInicianteInter = document.createElement("option");
    optionInicianteInter.value = "Iniciante a intermediário";
    optionInicianteInter.textContent = "Iniciante a intermediário";
    inputDificuldade.appendChild(optionInicianteInter);

    colunaDificuldade.appendChild(inputDificuldade);

    const inputTipo = document.createElement("input");
    inputTipo.type = "text";
    inputTipo.value = exercicio.tipo || '';
    colunaTipo.appendChild(inputTipo);

    const inputImagem = document.createElement("input");
    inputImagem.type = "file";
    colunaImagem.appendChild(inputImagem);

    const btnSalvar = document.createElement("button");
    btnSalvar.append(document.createTextNode("Salvar"));

    btnSalvar.onclick = function () {
        const novoExercicio = {
            nome: inputNome.value,
            musculo: inputMusculo.value,
            equipamento: inputEquipamento.value,
            dificuldade: inputDificuldade.value,
            instrucao: exercicio.instrucao,
            tipo: inputTipo.value,
            imagem: inputImagem.files[0] ? caminho + inputImagem.files[0].name : exercicio.imagem
        };



        fecth_exercicios_update(novoExercicio, exercicioid);
    };

    colunaSalvar.appendChild(btnSalvar);

    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaMusculo);
    linha.appendChild(colunaEquipamento);
    linha.appendChild(colunaDificuldade);
    linha.appendChild(colunaTipo);
    linha.appendChild(colunaImagem);
    linha.appendChild(colunaSalvar);
}


createExer.onclick = function () {

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

    // Create input elements
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.required = true;

    const inputMusculo = document.createElement("select");
    inputMusculo.id = "txtMusculo";
    inputMusculo.required = true;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Musculo";
    inputMusculo.appendChild(defaultOption);

    const optionBiceps = document.createElement("option");
    optionBiceps.value = "Bíceps";
    optionBiceps.textContent = "Bíceps";
    inputMusculo.appendChild(optionBiceps);

    const optionTriceps = document.createElement("option");
    optionTriceps.value = "Tríceps";
    optionTriceps.textContent = "Tríceps";
    inputMusculo.appendChild(optionTriceps);

    const optionPeito = document.createElement("option");
    optionPeito.value = "Peito";
    optionPeito.textContent = "Peito";
    inputMusculo.appendChild(optionPeito);

    const optionCostas = document.createElement("option");
    optionCostas.value = "Costas";
    optionCostas.textContent = "Costas";
    inputMusculo.appendChild(optionCostas);

    const optionOmbro = document.createElement("option");
    optionOmbro.value = "Ombro";
    optionOmbro.textContent = "Ombro";
    inputMusculo.appendChild(optionOmbro);

    const optionQuadriceps = document.createElement("option");
    optionQuadriceps.value = "Quadríceps";
    optionQuadriceps.textContent = "Quadríceps";
    inputMusculo.appendChild(optionQuadriceps);

    const inputEquipamento = document.createElement("input");
    inputEquipamento.type = "text";
    inputEquipamento.placeholder = "Equipamento";
    inputEquipamento.required = true;

    const inputDificuldade = document.createElement("select");
    inputDificuldade.id = "txtDificuldade";
    inputDificuldade.required = true;

    const defaultOption2 = document.createElement("option");
    defaultOption2.value = "";
    defaultOption2.disabled = true;
    defaultOption2.selected = true;
    defaultOption2.textContent = "Dificuldade";
    inputDificuldade.appendChild(defaultOption2);

    const optionIniciante = document.createElement("option");
    optionIniciante.value = "Iniciante";
    optionIniciante.textContent = "Iniciante";
    inputDificuldade.appendChild(optionIniciante);

    const optionIntermediario = document.createElement("option");
    optionIntermediario.value = "Intermediário";
    optionIntermediario.textContent = "Intermediário";
    inputDificuldade.appendChild(optionIntermediario);

    const optionInicianteInter = document.createElement("option");
    optionInicianteInter.value = "Iniciante a intermediário";
    optionInicianteInter.textContent = "Iniciante a intermediário";
    inputDificuldade.appendChild(optionInicianteInter);

    const inputInstrucao = document.createElement("textarea");
    inputInstrucao.placeholder = "Instrução";
    inputInstrucao.required = true;

    const inputTipo = document.createElement("input");
    inputTipo.type = "text";
    inputTipo.placeholder = "Tipo";
    inputTipo.required = true;

    const inputImagem = document.createElement("input");
    inputImagem.type = "file";
    inputImagem.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerHTML = "Registrar";
    submitButton.onclick = function () {
        const novoExercicio = {
            nome: inputNome.value,
            musculo: inputMusculo.value,
            equipamento: inputEquipamento.value,
            dificuldade: inputDificuldade.value,
            instrucao: inputInstrucao.value,
            tipo: inputTipo.value,
            imagem: caminho + inputImagem.files[0].name
        };
        fecth_exercicios_post(novoExercicio);
        modalCreate.style.display = "none";
    };


    modalContent.appendChild(closeModal);
    modalContent.appendChild(inputNome);
    modalContent.appendChild(inputMusculo);
    modalContent.appendChild(inputEquipamento);
    modalContent.appendChild(inputDificuldade);
    modalContent.appendChild(inputInstrucao);
    modalContent.appendChild(inputTipo);
    modalContent.appendChild(inputImagem);
    modalContent.appendChild(submitButton);


    modalCreate.appendChild(modalContent);


    document.body.appendChild(modalCreate);
};
