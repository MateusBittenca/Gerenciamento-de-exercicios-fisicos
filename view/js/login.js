const URI = '/usuario/login';
const txtEmail = document.getElementById("txtemail");
const txtSenha = document.getElementById("txtsenha");
const btnLogin = document.getElementById("btnLogin");
const divResposta = document.getElementById("divResposta");
btnLogin.addEventListener("click",(e)=>{
    e.preventDefault();
    onclick_btnLogin();
});

function onclick_btnLogin(){
    const email = txtEmail.value;
    const senha = txtSenha.value;
    const obj = {
        email:email,
        senha:senha
    };

    fetch_post_verificarLogin(obj);
}

function fetch_post_verificarLogin(obj){

    const textoJson = JSON.stringify(obj);
    const requisicao = fetch(URI,{
        method:'post',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':""
        },
        body: textoJson
    });
    requisicao.then((response)=>{return response.text();}).then((jsonTextoResposta)=>{
        
        const obj = JSON.parse(jsonTextoResposta);
        
        if(obj.status == true){
            localStorage.setItem("token",obj.token);
            localStorage.setItem("payload",JSON.stringify(obj.dados));
            window.location = "home.html";
        }else{
            const modal = document.createElement("div");
            modal.className = "modal";
            modal.style.display = "none";

            modal.style.display = "block";

            const modalContent = document.createElement("div");
            modalContent.className = "modal-content";

            const closeModal = document.createElement("span");
            closeModal.className = "close-button";
            closeModal.innerHTML = "&times;";
            closeModal.onclick = function () {
                modal.style.display = "none";
            };

            const mensagem = document.createElement("h2");
            mensagem.textContent = "Email ou senha incorretas!";

            modalContent.appendChild(closeModal);
            modalContent.appendChild(mensagem);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            txtEmail.value = "";
            txtSenha.value = "";

           
            console.log("erro ao logar")
        }  
    });
    requisicao.catch((erro)=>{
        console.log(erro);       
    });
    
}