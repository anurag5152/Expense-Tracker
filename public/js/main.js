const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

const expenseForm = document.getElementById('expenseForm');
const expenseListDiv = document.getElementById('expenseList');
const totalExpenseDiv = document.getElementById('totalExpense');
const expenseError = document.getElementById('expenseError');
let pieChart;

expenseForm.addEventListener('submit', async e => {
  e.preventDefault();
  expenseError.textContent = '';

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();

  if (!amount || !category || !date) {
    expenseError.textContent = 'Please fill all required fields.';
    return;
  }

  try {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount, category, date, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Failed to add expense');
    expenseForm.reset();
    fetchExpenses();
  } catch (err) {
    expenseError.textContent = err.message;
  }
});

async function fetchExpenses() {
  try {
    const res = await fetch('/api/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expenses = await res.json();
    renderExpenses(expenses);
    drawChart(expenses);
    updateTotal(expenses);
  } catch {
    expenseListDiv.innerHTML = '<p>Unable to fetch expenses.</p>';
  }
}

function renderExpenses(expenses) {
  if (!expenses.length) {
    expenseListDiv.innerHTML = '<p>No expenses yet.</p>';
    return;
  }
  expenseListDiv.innerHTML = '';
  expenses.forEach(exp => {
    const row = document.createElement('div');
    row.className = 'expense-item';
    row.innerHTML = `
      <span>${new Date(exp.date).toLocaleDateString()}</span>
      <span>${exp.category}</span>
      <span>₹ ${exp.amount.toFixed(2)}</span>
      <span class="description">${exp.description || ''}</span>
      <button data-id="${exp._id}">Delete</button>
    `;
    row.querySelector('button').addEventListener('click', () => deleteExpense(exp._id));
    expenseListDiv.appendChild(row);
  });
}

async function deleteExpense(id) {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    fetchExpenses();
  } catch {
    alert('Could not delete expense.');
  }
}

function drawChart(expenses) {
  const totals = {};
  expenses.forEach(e => (totals[e.category] = (totals[e.category] || 0) + e.amount));
  const labels = Object.keys(totals);
  const data = Object.values(totals);
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data }] } });
}

function updateTotal(expenses) {
  const sum = expenses.reduce((acc, e) => acc + e.amount, 0);
  totalExpenseDiv.textContent = `Total Expense: ₹ ${sum.toFixed(2)}`;
}

fetchExpenses();
