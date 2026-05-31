const expenseList = document.getElementById("expenseList");
const addBtn = document.getElementById("addBtn");
const filterCategory = document.getElementById("filterCategory");

let expenses = [];

async function loadExpenses() {
  try {
    const localData = localStorage.getItem("expenses");

    if (localData) {
      expenses = JSON.parse(localData);
    } else {
      const response = await fetch("expenses.json");
      expenses = await response.json();

      localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    displayExpenses(expenses);
  } catch (error) {
    console.log("Error loading expenses", error);
  }
}

loadExpenses();

addBtn.addEventListener("click", addExpense);

function addExpense() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!title || !amount) {
    alert("Please fill all input\ Fields ");
    return;
  }

  const newExpense = {
    id: Date.now(),
    title,
    amount: Number(amount),
    category
  };

  expenses.push(newExpense);

  saveExpenses();
  displayExpenses(expenses);

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
}

function displayExpenses(data) {
  expenseList.innerHTML = "";

  let total = 0;

  data.forEach((expense) => {
    total += expense.amount;

    expenseList.innerHTML += `
            <div class="expense-card">
                <h3 class="text-xl font-bold">
                    ${expense.title}
                </h3>

                <p class="text-gray-600 mt-3">
                    $${expense.amount}
                </p>

                <span class="text-cyan-600 font-semibold">
                    ${expense.category}
                </span>

                <br>

                <button 
                    onclick="deleteExpense(${expense.id})"
                    class="delete-btn"
                >
                    Delete
                </button>
            </div>
        `;
  });

  document.getElementById("totalAmount").innerText = `$${total}`;
}

function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);

  saveExpenses();
  displayExpenses(expenses);
}

filterCategory.addEventListener("change", function () {
  const selected = this.value;

  if (selected === "All") {
    displayExpenses(expenses);
  } else {
    const filterExpenses = expenses.filter(
      (expense) => expense.category === selected
    );

    displayExpenses(filterExpenses);
  }
});

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
