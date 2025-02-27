// For toggling theme
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const isDarkTheme = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  themeToggle.textContent = isDarkTheme ? '☀️ ' : '🌙 ';
});


const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '☀️ ';
}

// Sample Data
let transactions = [
  { date: '2025-02-01', description: 'Salary', amount: 3000, type: 'income' },
  { date: '2025-02-02', description: 'Rent', amount: 1000, type: 'expense' },
  { date: '2025-02-03', description: 'Groceries', amount: 200, type: 'expense' },
];

// DOM Elements
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expensesElement = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const addTransactionButton = document.getElementById('add-transaction');


let balanceChartInstance = null;
let pieChartInstance = null;

// Dashboard
function updateDashboard() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  balanceElement.textContent = `$${balance.toFixed(2)}`;
  incomeElement.textContent = `$${totalIncome.toFixed(2)}`;
  expensesElement.textContent = `$${totalExpenses.toFixed(2)}`;
}

//  Transactions
function renderTransactions() {
  transactionList.innerHTML = transactions
    .map(
      (t, index) => `
      <tr>
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td>$${t.amount.toFixed(2)}</td>
        <td>
          <button onclick="deleteTransaction(${index})">❌ </button>
        </td>
      </tr>
    `
    )
    .join('');
}

// To Delete Transaction
function deleteTransaction(index) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactions.splice(index, 1);
    updateDashboard();
    renderTransactions();
    renderCharts();
  }
}


function renderCharts() {
  const ctx = document.getElementById('financeChart').getContext('2d');
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  const labels = transactions.map(t => t.date);
  const balances = transactions.reduce((acc, t) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(lastBalance + (t.type === 'income' ? t.amount : -t.amount));
    return acc;
  }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (balanceChartInstance) balanceChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  balanceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Balance',
          data: balances,
          borderColor: '#007bff',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  pieChartInstance = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          label: 'Amount',
          data: [income, expenses],
          backgroundColor: ['#007bff', '#dc3545'],
        },
      ],
    },
  });
}

// To add Transaction
addTransactionButton.addEventListener('click', () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || isNaN(amount)) {
    alert('Please enter a valid description and amount.');
    return;
  }

  transactions.push({
    date: new Date().toISOString().split('T')[0],
    description: desc,
    amount: amount,
    type: type,
  });

  updateDashboard();
  renderTransactions();
  renderCharts();

  descInput.value = '';
  amountInput.value = '';
});

// Fade Effect
document.getElementById('logout-link').addEventListener('click', function(event) {
  event.preventDefault();
  document.body.style.opacity = '0';
  setTimeout(() => window.location.href = 'login.html', 500);
});


updateDashboard();
renderTransactions();
renderCharts();
