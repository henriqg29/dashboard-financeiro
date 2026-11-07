// MOSTRAR E OCULTAR AS SENHAS

// Capturando os elementos do html
const senha = document.getElementById("senha");
const togglePassword = document.getElementById("togglePassword");

// Evento de clique no botão

togglePassword.addEventListener("click", function () {
    if (senha.type === "password") {
        senha.type = "text"
        togglePassword.textContent = "Ocultar"
    } else {
        senha.type = "password"
        togglePassword.textContent = "Mostrar"
    }

})

// CAPTURANDO OS ELEMENTOS
const loginForm = document.getElementById("loginForm")
const email = document.getElementById("email")

loginForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const emailDigitado = email.value.trim()
    const senhaDigitada = senha.value

    if (validarDados(emailDigitado, senhaDigitada)) {
        const usuarioEncontrado = buscarUsuarios(emailDigitado)

        if(usuarioEncontrado === undefined){
            alert("E-mail não cadastrado!")
            return
        }
        if(usuarioEncontrado.senha !== senhaDigitada){
            alert("Senha incorreta!")
            return
        }
        alert("Login realizado com sucesso!")

        const sessao = {
            nome : usuarioEncontrado.nome,
            email : usuarioEncontrado.email
        }
        localStorage.setItem("usuarioLogado", JSON.stringify(sessao))
        window.location.href = "../principal/index.html"

    }
})

// VALIDAÇÃO DE DADOS
function validarDados(email, senha) {
    if (email.trim() === "") {
        alert("Por favor, informe seu e-mail.")
        return false
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Informe um e-mail válido.")
        return false
    }

    if (senha.trim() === "") {
        alert("Por favor, informe sua senha.")
        return false
    }
    return true
}

//AUTENTICAÇÃO 
function buscarUsuarios(emailDigitado) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

    const usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.email === emailDigitado
    })

    return usuarioEncontrado;
}