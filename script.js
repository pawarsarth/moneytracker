document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");

    // Fetch existing expenses
    const fetchExpenses = async () => {
        const response = await fetch('http://localhost:3000/expenses');
        const expenses = await response.json();
        displayExpenses(expenses);
        updateTotalAmount(expenses);
    };

    // Post a new expense
    const addExpense = async (expense) => {
        await fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });
        fetchExpenses();
    };

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = { name, amount, category, date };
        addExpense(expense);
        expenseForm.reset();
    });

    const displayExpenses = (expenses) => {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
            `;
            expenseList.appendChild(row);
        });
    };

    const updateTotalAmount = (expenses) => {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    };

    fetchExpenses();
});
