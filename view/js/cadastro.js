const URI = "/usuario/cadastrar";
const txtNome = document.getElementById("txtnome");
const txtEmail = document.getElementById("txtemail");
const txtSenha = document.getElementById("txtsenha");
const txtSexo = document.getElementById("txtSexo");
const txtPeso = document.getElementById("txtPeso");
const txtAltura = document.getElementById("txtAltura");
const btnCadastrar = document.getElementById("btncadastrar");

btnCadastrar.addEventListener("click", (e) => {
    e.preventDefault();
    onclick_btnCadastrar();
});

function onclick_btnCadastrar() {

    const NovoUsuario = {
        nome: txtNome.value,
        email: txtEmail.value,
        senha: txtSenha.value,
        sexo:txtSexo.value,
        altura:txtAltura.value,
        peso:txtPeso.value
    };
    fetch_post_cadastrarUsuario(NovoUsuario);
}

function fetch_post_cadastrarUsuario(NovoUsuario) {
    const UsuarioJson = JSON.stringify(NovoUsuario);
    const requisicao = fetch(URI, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': ""
        },
        body: UsuarioJson
    });
    requisicao.then((response) => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.text();
    }).then((jsonTextoResposta) => {
        const obj = JSON.parse(jsonTextoResposta);
        console.log(obj);

        if (obj.status == true) {
            alert("cadastro feito com sucesso");
            window.location = "login.html";
            
        } else {
            console.log("Falha ao registrar.");
            alert("Nâo foi possivel cadastrar esse usuario!");
        }
    }).catch((erro) => {
        console.log(erro);
    });
}
