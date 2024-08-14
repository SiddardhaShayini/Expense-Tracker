const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const historyLink = document.getElementById('history-link');
const historySection = document.getElementById('history-section');
const toggleModeBtn = document.getElementById('toggle-mode');
const body = document.body;
const currencySelect = document.getElementById('currency-select');
const addIncomeBtn = document.getElementById('add-income');
const addExpenseBtn = document.getElementById('add-expense');

let transactions = [];
let currencySymbol = '$';
let currentAction = 'income'; // Default to income

// Currency symbols mapping
const currencyMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
};

// Set the initial currency symbol
currencySymbol = currencyMap[currencySelect.value];

// Update the values displayed in the UI
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `${currencySymbol}${total}`;
    money_plus.innerText = `+${currencySymbol}${income}`;
    money_minus.innerText = `-${currencySymbol}${expense}`;
}

// Add a transaction to the DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.description} <span>${sign}${currencySymbol}${Math.abs(transaction.amount).toFixed(2)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Add a new transaction
function addTransaction(e) {
    e.preventDefault();

    if (description.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter a description and amount');
        return;
    }

    const transactionAmount = +amount.value;

    const transaction = {
        id: generateID(),
        description: description.value,
        amount: currentAction === 'expense' ? -transactionAmount : transactionAmount, // Apply sign based on current action
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    description.value = '';
    amount.value = '';
    form.style.display = 'none';
}

// Generate a random ID for each transaction
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Remove a transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
}

// Initialize the app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Show/Hide History
historyLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (historySection.style.display === 'none' || historySection.style.display === '') {
        historySection.style.display = 'block';
    } else {
        historySection.style.display = 'none';
    }
});

// Toggle between dark mode and light mode
toggleModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    toggleModeBtn.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Update the currency symbol when the currency is changed
currencySelect.addEventListener('change', () => {
    currencySymbol = currencyMap[currencySelect.value];
    updateValues();
});

// Show the form for adding income
addIncomeBtn.addEventListener('click', () => {
    form.style.display = 'block';
    amount.value = '';
    description.value = '';
    amount.placeholder = "Enter income amount...";
    amount.removeAttribute('min'); // Remove min attribute
    amount.removeAttribute('max'); // Remove max attribute
    amount.type = 'number'; // Ensure input type is number
    description.placeholder = "Enter income description...";
    currentAction = 'income'; // Set current action to income
});

// Show the form for adding expense
addExpenseBtn.addEventListener('click', () => {
    form.style.display = 'block';
    amount.value = '';
    description.value = '';
    amount.placeholder = "Enter expense amount...";
    amount.removeAttribute('min'); // Remove min attribute
    amount.removeAttribute('max'); // Remove max attribute
    amount.type = 'number'; // Ensure input type is number
    description.placeholder = "Enter expense description...";
    currentAction = 'expense'; // Set current action to expense
});

form.addEventListener('submit', addTransaction);

init();
