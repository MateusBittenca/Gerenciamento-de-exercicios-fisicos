const obj = existeSessao();
const token = localStorage.getItem("token");
const URI = "/admin";
let admin_json = {};
const txtFiltro = document.getElementById("txtFiltro");
const tblAdmin = document.getElementById("tblAdmin");
const createAdmin = document.getElementById("Create-admin");

txtFiltro.addEventListener('input', function () {
    construirTabela(txtFiltro.value);
});

fetch_admin_get();

function fetch_admin_get() {
    const requisicao = fetch(URI, {
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
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            admin_json = obj.dados;
            construirTabela();
        } else {
            alert("login invalido");
        }
    });
}

function fetch_admin_post(novoAdmin) {
    const jsonAdmin = JSON.stringify(novoAdmin);
    const rota = URI + "/cadastrar";
    const requisicao = fetch(rota, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: jsonAdmin
    });

    requisicao.then((response) => {
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fetch_admin_get();

            Swal.fire({
                color:"white",
                background : "#1f2021",
                title: "Sucesso!",
                text: "Usuario criado com sucesso!",
                icon: "success"
              });

        } else {
            alert("login invalido!");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function fetch_admin_delete(adminId) {
    const rota = "/admin/" + adminId;
    const requisicao = fetch(rota, {
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
            fetch_admin_get();
        } else {
            alert("Login invalido");
        }
    }).catch((erro) => {
        console.log(erro);
    });

}

function fetch_admin_update(novoAdmin, adminId) {
    const jsonAdmin = JSON.stringify(novoAdmin);
    const rota = "admin/" + adminId;
    const requisicao = fetch(rota, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: jsonAdmin
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
            fetch_admin_get();

            Swal.fire({
                color:"white",
                background : "#1f2021",
                title: "Sucesso!",
                text: "Usuario modificado com sucesso!",
                icon: "success"
              });
        } else {
            alert("Login invalido!");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}


function limparTabela() {
    let qtdLinhas = tblAdmin.rows.length;
    for (let i = qtdLinhas - 1; i > 0; i--) {
        tblAdmin.deleteRow(i);
    }
}

function construirTabela(filtro = null) {
    limparTabela();
    for (let admin of admin_json) {
        if (filtro != null) {
            let nomeAdmin = admin.Nome.toLowerCase();
            filtro = filtro.toLowerCase();
            if (!nomeAdmin.includes(filtro)) {
                continue;
            }
        }

        const linha = document.createElement("tr");
        const colunaId = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaEmail = document.createElement('td');

        const colunaExcluir = document.createElement('td');
        const colunaEditar = document.createElement('td');

        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn-excluir";
        btnExcluir.append(document.createTextNode("Excluir"));
        btnExcluir.onclick = function () {
            const id = admin.AdministradorID;
            Swal.fire({
                title: "Você tem certeza?",
                text: "Você não poderá reverter a sua escolha!",
                icon: "warning",
                showCancelButton: true,
                color:"white",
                background : "#1f2021",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar!",
                confirmButtonText: "Sim!"
              }).then((result) => {
                if (result.isConfirmed) {
                    fetch_admin_delete(id);
                  Swal.fire({
                    title: "Excluido!",
                    color:"white",
                    background : "#1f2021",
                    text: "Usuario excluido!.",
                    icon: "success"
                  });
                }
              });

           
        };

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn-editar";
        btnEditar.append(document.createTextNode("Editar"));
        btnEditar.onclick = function () {
            editarLinha(linha, admin);
        };

        colunaId.append(document.createTextNode(admin.AdministradorID));
        colunaNome.append(document.createTextNode(admin.Nome));
        colunaEmail.append(document.createTextNode(admin.Email));
        colunaExcluir.append(btnExcluir);
        colunaEditar.append(btnEditar);

        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaEmail);
        linha.appendChild(colunaExcluir);
        linha.appendChild(colunaEditar);

        tblAdmin.appendChild(linha);
    }
}

function editarLinha(linha, admin) {
    linha.innerHTML = '';

    const colunaId = document.createElement("td");
    const colunaNome = document.createElement("td");
    const colunaEmail = document.createElement("td");
    const colunaSalvar = document.createElement("td");

    colunaId.append(document.createTextNode(admin.AdministradorID));
    const adminId = admin.AdministradorID;

    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = admin.Nome;  // Corrigido para usar 'Nome'
    colunaNome.appendChild(inputNome);

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.value = admin.Email;  // Corrigido para usar 'Email'
    colunaEmail.appendChild(inputEmail);

    const btnSalvar = document.createElement("button");
    btnSalvar.append(document.createTextNode("Salvar"));

    btnSalvar.onclick = function () {
        const novoAdmin = {
            nome: inputNome.value,
            email: inputEmail.value
            
        };

        fetch_admin_update(novoAdmin, adminId);
    };
    colunaSalvar.appendChild(btnSalvar);

    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaSalvar);
}

createAdmin.onclick = function () {
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

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.placeholder = "Email";
    inputEmail.required = true;

    const inputSenha = document.createElement("input");
    inputSenha.type = "password";
    inputSenha.placeholder = "Senha";
    inputSenha.required = true;


    const submitButton = document.createElement("button");
    submitButton.innerHTML = "Confirmar";
    submitButton.onclick = function () {
        const novoAdmin = {
            nome: inputNome.value,
            email: inputEmail.value,
            senha: inputSenha.value
        }
        fetch_admin_post(novoAdmin);
        modalCreate.style.display = "none";
    }

    modalContent.appendChild(closeModal);
    modalContent.appendChild(inputNome);
    modalContent.appendChild(inputEmail);
    modalContent.appendChild(inputSenha);
    modalContent.appendChild(submitButton);

    modalCreate.appendChild(modalContent);
    document.body.appendChild(modalCreate);
}
