const obj = existeSessao();
const token = localStorage.getItem("token");
const URI = "/usuarios";
let usuario_json = {};
const txtFiltro = document.getElementById("txtFiltro");
const tblUsuario = document.getElementById("tblUsuarios");

txtFiltro.addEventListener('input', function () {
    construirTabela(txtFiltro.value);
});

fetch_usuarios_get();

function fetch_usuarios_get(){
    const requisicao = fetch(URI, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
    });

    requisicao.then((response)=>{
        return response.text();
    }).then((jsonTextoResposta)=>{
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if(obj.status == true){
            localStorage.setItem("token", obj.token);
            usuario_json = obj.dados;
            construirTabela();
        } else {
            alert("login invalido");
        }
    });
}

function fetch_usuarios_delete(usuarioId){
    const rota = "/usuario/"+usuarioId;
    const requisicao = fetch(rota,{
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
        console.log(jsonTextoResposta);
        const obj = JSON.parse(jsonTextoResposta);

        if (obj.status == true) {
            localStorage.setItem("token", obj.token);
            fetch_usuarios_get();
        } else {
         alert("Login invalido");
        }
    }).catch((erro) => {
        console.log(erro);
    });

}

function fetch_usuarios_updateno(novoUsuario, usuarioId){
    const jsonUsuario = JSON.stringify(novoUsuario);
    const rota =  "usuario/" + usuarioId;
    const requisicao = fetch(rota,{
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
        body: jsonUsuario
    });

    requisicao.then((response)=>{
        if(!response.ok){
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta)=>{
        const obj = JSON.parse(jsonTextoResposta);

        if(obj.status == true){
            localStorage.setItem("token",obj.token);
            fetch_usuarios_get();
            Swal.fire({
                title: "Sucesso!",
                text: "Dados do usuario modificados!",
                icon: "success"
              });
        }else{
            alert("Login invalido!");
        }
    }).catch((erro)=>{
        console.log(erro);
    });
}

function limparTabela(){
    let qtdLinhas = tblUsuario.rows.length;
    for(let i = qtdLinhas - 1; i > 0; i--){
        tblUsuario.deleteRow(i);
    }
}

function construirTabela(filtro = null){
    limparTabela();
    for (let usuario of usuario_json){
        if(filtro != null){
            let nomeUsuario = usuario.Nome.toLowerCase();
            filtro = filtro.toLowerCase();
            if(!nomeUsuario.includes(filtro)){
                continue;
            }
        }

        const linha = document.createElement("tr");
        const colunaId = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaEmail = document.createElement('td');
        const colunaSexo = document.createElement('td');
        const colunaAltura = document.createElement('td');
        const colunaPeso = document.createElement('td');
        const colunaExcluir = document.createElement('td');
        const colunaEditar = document.createElement('td');

        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn-excluir";
        btnExcluir.append(document.createTextNode("Excluir"));
        btnExcluir.onclick = function () {
            const id = usuario.UsuarioID;
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
                    fetch_usuarios_delete(id);
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
            editarLinha(linha, usuario);
        };

        colunaId.append(document.createTextNode(usuario.UsuarioID));
        colunaNome.append(document.createTextNode(usuario.Nome));
        colunaEmail.append(document.createTextNode(usuario.Email));
        colunaSexo.append(document.createTextNode(usuario.Sexo || ''));
        colunaAltura.append(document.createTextNode(usuario.Altura || ''));
        colunaPeso.append(document.createTextNode(usuario.Peso || ''));
        colunaExcluir.append(btnExcluir);
        colunaEditar.append(btnEditar);

        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaEmail);
        linha.appendChild(colunaSexo);
        linha.appendChild(colunaAltura);
        linha.appendChild(colunaPeso);
        linha.appendChild(colunaExcluir);
        linha.appendChild(colunaEditar);

        tblUsuario.appendChild(linha);
    }
}

function editarLinha(linha, usuario) {
    linha.innerHTML = '';

    const colunaId = document.createElement("td");
    const colunaNome = document.createElement("td");
    const colunaEmail = document.createElement("td");
    const colunaSexo = document.createElement("td");
    const colunaAltura = document.createElement("td");
    const colunaPeso = document.createElement("td");
    const colunaSalvar = document.createElement("td");

    colunaId.append(document.createTextNode(usuario.UsuarioID));
    const usuarioId = usuario.UsuarioID;

    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = usuario.Nome;
    colunaNome.appendChild(inputNome);

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.value = usuario.Email;
    colunaEmail.appendChild(inputEmail);

    const inputSexo = document.createElement("select");
    inputSexo.id = "txtsexo";
    inputSexo.required = true;

    // Cria a primeira opção que será desabilitada e selecionada por padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Sexo";
    inputSexo.appendChild(defaultOption);


    const optionFeminino = document.createElement("option");
    optionFeminino.value = "Feminino";
    optionFeminino.textContent = "Feminino";
    inputSexo.appendChild(optionFeminino);

   
    const optionMasculino = document.createElement("option");
    optionMasculino.value = "Masculino";
    optionMasculino.textContent = "Masculino";
    inputSexo.appendChild(optionMasculino);

    
    if (usuario.Sexo) {
    inputSexo.value = usuario.Sexo;
    }

   
    colunaSexo.appendChild(inputSexo);

    const inputAltura = document.createElement("input");
    inputAltura.type = "text";
    inputAltura.value = usuario.Altura || '';
    colunaAltura.appendChild(inputAltura);

    const inputPeso = document.createElement("input");
    inputPeso.type = "text";
    inputPeso.value = usuario.Peso || '';
    colunaPeso.appendChild(inputPeso);

    const btnSalvar = document.createElement("button");
    btnSalvar.append(document.createTextNode("Salvar"));

    btnSalvar.onclick = function () {
        const novoUsuario = {
            nome: inputNome.value,
            email: inputEmail.value,
            sexo: inputSexo.value,
            altura: inputAltura.value,
            peso: inputPeso.value
        };

        console.log('Novo usuário:', novoUsuario); // Log para depuração

        fetch_usuarios_updateno(novoUsuario, usuarioId);
    };
    colunaSalvar.appendChild(btnSalvar);

    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaSexo);
    linha.appendChild(colunaAltura);
    linha.appendChild(colunaPeso);
    linha.appendChild(colunaSalvar);
}



