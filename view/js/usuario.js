const obj = existeSessao();
const usuarioId = obj.usuarioId;
const URI = "/usuario";
const token = localStorage.getItem("token");
let usuario_json = {};

divUsuario.append(document.createTextNode(obj.nome));

const txtNome = document.getElementById("nome");
const txtEmail = document.getElementById("email");
const txtSexo = document.getElementById("sexo");
const txtPeso = document.getElementById("peso");
const btnEditar = document.getElementById("btnEditar");
const txtAltura = document.getElementById("txtAltura");
const btnLogout = document.getElementById("Logout");

fetch_usuario_get(usuarioId); 

btnLogout.onclick = function(){
localStorage.clear();
}


function fetch_usuario_get(usuarioId) {
    const rota = URI + "/" + usuarioId;
    const requisicao = fetch(rota, {
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
            console.log(jsonTextoResposta);
            usuario_json = obj.dados;
    


            preencherDadosUsuario();
        } else {
            alert("login invalido");
        }
    })
}



function fetch_usuario_update(novoUsuario, usuarioId) {
    const Jsonusuario = JSON.stringify(novoUsuario);
    const rota = URI + "/" + usuarioId;
    const requisicao = fetch(rota, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer <" + token + ">"
        },
        body: Jsonusuario
    });

    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
    }).then((obj) => {
        console.log(obj);
        if (obj.status == true) {

            localStorage.setItem("token", obj.token);

            fetch_usuario_get(usuarioId);
        } else {
            alert("Login Inválido!");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function preencherDadosUsuario() {
    for(let usuario of usuario_json){

        txtNome.value = usuario.Nome;
        txtEmail.value = usuario.Email;
        txtAltura.value = usuario.Altura;
        txtSexo.value = usuario.Sexo;
        txtPeso.value = usuario.Peso;
    }

}

btnEditar.onclick = function() {    
    // Esconder o botão "Editar"
    btnEditar.style.display = "none";

    // Habilitar os campos para edição
    txtNome.removeAttribute("readonly");
    txtEmail.removeAttribute("readonly");
    txtAltura.removeAttribute("readonly");
    txtPeso.removeAttribute("readonly");

    // Criar o botão "Salvar"
    const btnSalvar = document.createElement("button");
    btnSalvar.className = "btnSalvar";
    btnSalvar.append(document.createTextNode("Salvar"));

    // Criar o botão "Descartar"
    const btnDescartar = document.createElement("button");
    btnDescartar.className = "btnDescartar";
    btnDescartar.append(document.createTextNode("Descartar"));

    // Adicionar os botões ao DOM, por exemplo, abaixo do último input
    txtPeso.parentNode.appendChild(btnSalvar);
    txtPeso.parentNode.appendChild(btnDescartar);

    // Função para salvar as alterações
    btnSalvar.onclick = function() {
        
        const novoUsuario = {
            nome: txtNome.value,
            email: txtEmail.value,
            altura: txtAltura.value,
            sexo: txtSexo.value,
            peso: txtPeso.value
        };

        fetch_usuario_update(novoUsuario, usuarioId);

        txtNome.setAttribute("readonly", true);
        txtEmail.setAttribute("readonly", true);
        txtAltura.setAttribute("readonly", true);

        txtPeso.setAttribute("readonly", true);

        btnSalvar.remove();
        btnDescartar.remove();

        // Mostrar o botão "Editar" novamente
        btnEditar.style.display = "block";

        preencherDadosUsuario();

    }

    // Função para descartar as alterações e reverter ao estado original
    btnDescartar.onclick = function() {
        // Desabilitar os campos de volta
        txtNome.setAttribute("readonly", true);
        txtEmail.setAttribute("readonly", true);
        txtAltura.setAttribute("readonly", true);
        txtPeso.setAttribute("readonly", true);

        // Remover os botões "Salvar" e "Descartar"
        btnSalvar.remove();
        btnDescartar.remove();

        // Mostrar o botão "Editar" novamente
        btnEditar.style.display = "block";

        // Repreencher os campos com os dados atuais
        preencherDadosUsuario();
    };
};
