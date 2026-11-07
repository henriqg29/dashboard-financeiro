//VERIFICAR USUARIO LOGADO
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

if(!usuarioLogado){
    window.location.href = "../login/login.html"
}

//Botão de abrir o modal
const addTransactionButton = document.querySelector(".add-transaction")
//Modal
const transactionModal = document.getElementById("transactionModal")
//Botão de fechar
const closeModalButton = document.getElementById("closeModal")

//abrir o modal
addTransactionButton.addEventListener("click", function(){
    transactionModal.style.display = "flex"
})

//fechar ao clicar no X
closeModalButton.addEventListener("click", function(){
    transactionModal.style.display = "none"
})

//Lista de transações
//Usamos try/catch aqui porque, se o localStorage tiver algo inválido salvo,
//o JSON.parse quebra e trava o script inteiro. Assim, se der erro, a lista
//só começa vazia em vez de travar tudo.
let transactions = []
try {
    transactions = JSON.parse(localStorage.getItem("transactions")) || []
} catch (error) {
    transactions = []
}

//Formulário
const transactionForm = document.getElementById("transactionForm")
//Cards
const balanceCard = document.getElementById("balance")
const incomeCard = document.getElementById("income")
const expenseCard = document.getElementById("expense")

//Salvar transação
transactionForm.addEventListener("submit", (event) => {
    event.preventDefault()

    //pegando valores do formulário
    const name = document.getElementById("transactionName").value 
    const value = Number(
        document.getElementById("transactionValue").value
    )
    const type = document.getElementById("transactionType").value
    const category = document.getElementById("transactionCategory").value

    //Criando objeto da transação
    const transaction = {
        id: Date.now(),
        name,
        value,
        type,
        category
    }

    //Adiciona na lista
    transactions.push(transaction)
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    )

    //Atualiza os valores
    updateBalance()
    renderTransaction()
    updateChart()

    //Fecha o modal
    transactionModal.style.display = "none"
    //Limpa o formulário
    transactionForm.reset()
})

function updateBalance() {
    let income = 0
    let expense = 0

    transactions.forEach(transaction =>{
        if(transaction.type === "income"){
            income += transaction.value
        } else if (transaction.type === "expense"){
            expense += transaction.value
        }
    })
    const balance = income - expense 

    balanceCard.textContent = formatCurrency(balance)
    incomeCard.textContent = formatCurrency(income)
    expenseCard.textContent = formatCurrency(expense)
}

function formatCurrency(value){
    return value.toLocaleString("pt-BR", {
        style:"currency",
        currency:"BRL"
    })
}
let financialChart = null

function updateChart(){
    const chartCanvas = document.getElementById("financialChart")

    let income = 0
    let expense = 0

    transactions.forEach(transaction => {
        if(transaction.type === "income"){
            income += transaction.value 
        } else if(transaction.type === "expense"){
            expense += transaction.value
        }
    })
//Se ja existir um grafico, remove antes de criar outro
    if(financialChart){
        financialChart.destroy()
    }
//Cria o gráfico
    financialChart = new Chart(chartCanvas, {
        type: "bar",
        data:{
        labels: ["Receitas", "Despesas"],
        datasets:[{
            label:"Valores em R$",
            data: [income,expense],

            borderWidth: 1,
            borderRadius:8
        }]
        },
        options:{
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display:false
                }
            },
            scales:{
                y:{
                    beginAtZero: true
                }
            }
        }
    })
}

const transactionList = document.getElementById("transactionList")

//Aqui era o principal bug: o forEach usava "transactions" (igual à lista de fora)
//como nome do parâmetro, mas dentro da função usávamos "transaction" (singular),
//que não existia. Isso gerava "transaction is not defined" e travava a função inteira.
function renderTransaction(){
    transactionList.innerHTML = ""

    //Se não tiver nenhuma transação, mostra a mensagem padrão
    if(transactions.length === 0){
        transactionList.innerHTML = "<p>Nenhuma transação cadastrada</p>"
        return
    }

    transactions.forEach(transaction => {
        const li = document.createElement("div")
        li.classList.add("transaction-item")
        li.innerHTML = `
            <div class="transaction-info">
                <h3>${transaction.name}</h3>
                <p>${transaction.category}</p>
            </div>
            <div class="transaction-actions">
                <div class="transaction-value 
                ${transaction.type === "income" 
                ? "transaction-income" 
                : "transaction-expense"}">
                    ${transaction.type === "income" ? "+" : "-"}
                    ${formatCurrency(transaction.value)}
                </div>
                <button class="delete-transaction" data-id="${transaction.id}">
                    🗑️
                </button>
            </div>
        `
        transactionList.appendChild(li)
    })
}

//Excluir transação
//Usamos "delegação de evento": em vez de colocar um addEventListener em cada
//botão de excluir (que nem existem ainda quando a página carrega), escutamos
//o clique na lista inteira e checamos se quem foi clicado é um botão de excluir.
transactionList.addEventListener("click", (event) => {
    //Verifica se o elemento clicado (ou algum pai próximo) tem a classe delete-transaction
    const deleteButton = event.target.closest(".delete-transaction")

    if(!deleteButton){
        return
    }

    //Pega o id que guardamos no data-id do botão
    const id = Number(deleteButton.dataset.id)

    //Filtra a lista, mantendo só as transações com id diferente da excluída
    transactions = transactions.filter(transaction => transaction.id !== id)

    //Salva a lista atualizada no localStorage
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    )

    //Atualiza tudo na tela
    updateBalance()
    renderTransaction()
    updateChart()
})

window.addEventListener("load",() =>{
    updateBalance()
    renderTransaction()
    updateChart()
})