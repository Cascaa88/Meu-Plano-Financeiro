document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const addTransactionBtn = document.getElementById('add-transaction');
    const transactionsList = document.getElementById('transactions');
    const totalIncomeDisplay = document.getElementById('total-income');
    const totalExpensesDisplay = document.getElementById('total-expenses');
    const currentBalanceDisplay = document.getElementById('current-balance');
    const noTransactionsMessage = document.getElementById('no-transactions-message');

    // Array para armazenar as transações
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return `R$ ${value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.')}`;
    };

    // Função para renderizar as transações na lista
    const renderTransactions = () => {
        transactionsList.innerHTML = ''; // Limpa a lista antes de renderizar
        if (transactions.length === 0) {
            noTransactionsMessage.style.display = 'block';
        } else {
            noTransactionsMessage.style.display = 'none';
            transactions.forEach(transaction => {
                const li = document.createElement('li');
                li.classList.add(transaction.type); // Adiciona classe 'income' ou 'expense' para estilização
                li.innerHTML = `
                    <span>${transaction.description}</span>
                    <span>${formatCurrency(transaction.amount)}</span>
                    <button class="delete-btn" data-id="${transaction.id}">X</button>
                `;
                transactionsList.appendChild(li);
            });
        }
    };

    // Função para calcular e atualizar os totais
    const updateTotals = () => {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpenses;

        totalIncomeDisplay.textContent = formatCurrency(totalIncome);
        totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
        currentBalanceDisplay.textContent = formatCurrency(currentBalance);

        // Altera a cor do saldo se for negativo
        if (currentBalance < 0) {
            currentBalanceDisplay.style.color = '#e74c3c'; // Vermelho
        } else if (currentBalance > 0) {
            currentBalanceDisplay.style.color = '#27ae60'; // Verde
        } else {
            currentBalanceDisplay.style.color = '#333'; // Padrão
        }
    };

    // Função para adicionar uma nova transação
    const addTransaction = () => {
        const description = descriptionInput.value.trim();
        let amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        if (description === '' || isNaN(amount) || amount <= 0) {
            alert('Por favor, preencha a descrição e um valor válido (maior que zero).');
            return;
        }

        // Se for despesa, o valor deve ser negativo (para cálculo)
        if (type === 'expense') {
            amount = Math.abs(amount); // Garante que é positivo para adicionar ao total de despesas, mas pode ser tratado como negativo internamente se preferir.
                                       // No nosso caso, o filtro por 'type' já lida com isso.
        }

        const newTransaction = {
            id: Date.now(), // ID único baseado no timestamp
            description,
            amount,
            type
        };

        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions)); // Salva no Local Storage

        descriptionInput.value = ''; // Limpa o input
        amountInput.value = '';      // Limpa o input
        typeSelect.value = 'income'; // Reseta o tipo

        renderTransactions();
        updateTotals();
    };

    // Função para remover uma transação
    const deleteTransaction = (id) => {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions)); // Salva no Local Storage
        renderTransactions();
        updateTotals();
    };

    // Event Listeners
    addTransactionBtn.addEventListener('click', addTransaction);

    transactionsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const idToDelete = parseInt(e.target.dataset.id);
            deleteTransaction(idToDelete);
        }
    });

    // Inicializa a aplicação carregando dados e atualizando a interface
    renderTransactions();
    updateTotals();
});