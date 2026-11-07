// CAPTURANDO ELEMENTOS DO HTML
const cadastroForm = document.getElementById("cadastroForm")
const nome = document.getElementById("nome")
const emailCadastro = document.getElementById("emailCadastro")
const senhaCadastro = document.getElementById("senhaCadastro")
const confirmarSenha = document.getElementById("confirmarSenha")

// CAPTURANDO DADOS DO CADASTRO
cadastroForm.addEventListener("submit", function(event){
    event.preventDefault()

    const nomeDigitado = nome.value
    const emailDigitado = emailCadastro.value 
    const senhaDigitada = senhaCadastro.value 
    const confirmacaoSenha = confirmarSenha.value
})

// VALIDAÇÃO DO CADASTRO
function validarCadastro(nome,email,senha,confirmacaoSenha){

    if(nome.trim() === ""){
        alert("Por favor, informe seu nome completo.")
        return false
    }
    if(!email.includes("@") || !email.includes(".")){
        alert("Por favor, informe seu e-mail válido.")
        return false
    }
    if(senha.length < 8){
        alert("A senha precisa ter 8 caracteres, no mínimo.")
        return false
    }
    if(senha !== confirmacaoSenha){
        alert("As senhas não coincidem")
        return false
    }
    return true
}

// ENVIO DO FORMULÁRIO
cadastroForm.addEventListener("submit", function(event){
    event.preventDefault()

    const nomeDigitado = nome.value.trim()
    const emailDigitado = emailCadastro.value.trim()
    const senhaDigitada = senhaCadastro.value
    const confirmacaoDigitada = confirmarSenha.value

    if(validarCadastro(nomeDigitado,emailDigitado,senhaDigitada,confirmacaoDigitada)){

        const novoUsuario = {
            nome : nomeDigitado,
            email : emailDigitado,
            senha : senhaDigitada
        }

        salvarUsuario(novoUsuario)
        alert("Cadastro realizado com sucesso!")
        cadastroForm.reset()

        console.log(novoUsuario)
    }
})

// ARMAZENANDO USUÁRIOS PS: LOCALSTORAGE PROVISORIO

function salvarUsuario(usuario){
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))|| []
    usuarios.push(usuario)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}