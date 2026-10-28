
const storageKey = "businessManagerPurchases";

let purchases = JSON.parse(
  localStorage.getItem(storageKey) || "[]"
);

const form = document.getElementById("productForm");
const table = document.getElementById("inventoryTable");

function savePurchases() {
  localStorage.setItem(storageKey, JSON.stringify(purchases));
}


function showPurchases() {
  table.innerHTML = "";

  purchases.forEach((purchase) => {
    const row = document.createElement("tr");

    [
      purchase.name,
      purchase.quantity,
      "$" + purchase.cost.toFixed(2),
      purchase.date
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.className = "delete-button";



    deleteButton.addEventListener("click", () => {
      const hasSales = sales.some(
        sale => sale.purchaseId === purchase.id
      );

      if (hasSales) {
        alert("This purchase has recorded sales and cannot be deleted.");
        return;
      }

      if (!confirm("Delete this inventory purchase?")) return;

      purchases = purchases.filter(
        item => item.id !== purchase.id
      );

      savePurchases();
      showPurchases();
      updateBatchOptions();
      updateDashboard();
      updateFinancialDashboard();
      updateNetProfit();
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    table.appendChild(row);
  });
}


form.addEventListener("submit", (event) => {
  event.preventDefault();

  const purchase = {
    id: crypto.randomUUID(),
    name: document.getElementById("productName").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    cost: Number(document.getElementById("purchaseCost").value),
    expectedPrice: Number(document.getElementById("sellingPrice").value),
    date: document.getElementById("purchaseDate").value
  };

 
purchases.push(purchase);
savePurchases();
showPurchases();
updateDashboard();
updateBatchOptions();
updateFinancialDashboard();
form.reset();
});

showPurchases();

function updateDashboard() {
  const totalUnits = purchases.reduce(
    (sum, purchase) => sum + purchase.quantity,
    0
  );

  const totalCost = purchases.reduce(
    (sum, purchase) => sum + purchase.quantity * purchase.cost,
    0
  );

  document.getElementById("totalProducts").textContent =
    totalUnits.toLocaleString();

  document.getElementById("totalInventoryCost").textContent =
    totalCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
}

updateDashboard();

function updateFinancialDashboard() {
  const revenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);

  const costOfGoodsSold = sales.reduce(
    (sum, sale) => sum + sale.cost, 0
  );

  const grossProfit = revenue - costOfGoodsSold;

  const remainingUnits = purchases.reduce(
    (sum, purchase) => sum + remainingQuantity(purchase), 0
  );

  document.getElementById("totalProducts").textContent =
    remainingUnits.toLocaleString();

  document.querySelectorAll(".card").forEach(card => {
    const heading = card.querySelector("h3");
    const value = card.querySelector("h2");

    if (!heading || !value) return;

    if (heading.textContent.trim() === "Gross Profit") {
      value.textContent = money(grossProfit);
    }
  });
}

const salesKey = "businessManagerSales";

let sales = JSON.parse(
  localStorage.getItem(salesKey) || "[]"
);

const saleForm = document.getElementById("saleForm");
const saleBatch = document.getElementById("saleBatch");
const salesTable = document.getElementById("salesTable");

function money(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function remainingQuantity(purchase) {
  const sold = sales
    .filter(sale => sale.purchaseId === purchase.id)
    .reduce((sum, sale) => sum + sale.quantity, 0);

  return purchase.quantity - sold;
}

function updateBatchOptions() {
  saleBatch.innerHTML = "";

  purchases.forEach(purchase => {
    const remaining = remainingQuantity(purchase);

    if (remaining <= 0) return;

    const option = document.createElement("option");
    option.value = purchase.id;
    option.textContent =
      `${purchase.name} | ${purchase.date} | ` +
      `${money(purchase.cost)} each | ${remaining} left`;

    saleBatch.appendChild(option);
  });
}



function showSales() {
  salesTable.innerHTML = "";

  sales.forEach((sale) => {
    const row = document.createElement("tr");

    [
      sale.productName,
      sale.salesPlatform || "Not recorded",
      sale.paymentMethod || "Not recorded",
      sale.quantity,
      money(sale.revenue),
      money(sale.cost),
      money(sale.profit),
      sale.date
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.className = "edit-button";


editButton.addEventListener("click", () => {
  document.getElementById("editSaleId").value = sale.id;
  document.getElementById("editSaleQuantity").value = sale.quantity;
  document.getElementById("editSalePrice").value = sale.price;
  document.getElementById("editSalesPlatform").value =
    sale.salesPlatform || "Facebook Marketplace";
  document.getElementById("editPaymentMethod").value =
    sale.paymentMethod || "Cash";
  document.getElementById("editSaleDate").value = sale.date;

  document.getElementById("editSaleOverlay").hidden = false;
  document.body.style.overflow = "hidden";
});
 



 

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

deleteButton.addEventListener("click", () => {
  if (!confirm("Delete this sale and return the items to inventory?")) {
    return;
  }

  sales = sales.filter(item => item.id !== sale.id);
  localStorage.setItem(salesKey, JSON.stringify(sales));

  showSales();
  showPurchases();
  updateBatchOptions();
  updateFinancialDashboard();
  updateNetProfit();
  updateProfitExpenseChart();
});

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    salesTable.appendChild(row);

  });
}

  const revenue = sales.reduce(
    (sum, sale) => sum + sale.revenue, 0
  );

  const costOfGoodsSold = sales.reduce(
    (sum, sale) => sum + sale.cost, 0
  );

  const grossProfit = revenue - costOfGoodsSold;

  const remainingUnits = purchases.reduce(
    (sum, purchase) => sum + remainingQuantity(purchase),
    0
  );

  document.getElementById("totalProducts").textContent =
    remainingUnits.toLocaleString();

  // The original purchase-cost card remains
  // a total of all recorded purchases.
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const heading = card.querySelector("h3");
    const value = card.querySelector("h2");

    if (!heading || !value) return;

    if (heading.textContent === "Gross Profit") {
      value.textContent = money(grossProfit);
    }

    if (heading.textContent === "Net Profit") {
      // Other business expenses aren't tracked yet.
      value.textContent = "Coming soon";
    }
  });

saleForm.addEventListener("submit", event => {
  event.preventDefault();

  const purchase = purchases.find(
    item => item.id === saleBatch.value
  );

  const quantity = Number(
    document.getElementById("saleQuantity").value
  );

  const price = Number(
    document.getElementById("salePrice").value
  );

  const date = document.getElementById("saleDate").value;

const salesPlatform =
  document.getElementById("salesPlatform").value;

const paymentMethod =
  document.getElementById("paymentMethod").value;

  if (
    !purchase ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > remainingQuantity(purchase) ||
    !Number.isFinite(price) ||
    price < 0 ||
    !date
  ) {
    alert("Please check your sale details and available stock.");
    return;
  }

  const revenue = Math.round(quantity * price * 100) / 100;
  const cost = Math.round(quantity * purchase.cost * 100) / 100;

  sales.push({
    id: crypto.randomUUID(),
    purchaseId: purchase.id,
    productName: purchase.name,
salesPlatform,
paymentMethod,
    quantity,
    price,
    revenue,
    cost,
    profit: revenue - cost,
    date
  });

  localStorage.setItem(salesKey, JSON.stringify(sales));

  
showSales();
updateBatchOptions();
updateFinancialDashboard();
updateNetProfit();
updateProfitExpenseChart();
saleForm.reset();
});

updateBatchOptions();
showSales();
updateFinancialDashboard();

const expensesKey = "businessManagerExpenses";

let expenses = JSON.parse(
  localStorage.getItem(expensesKey) || "[]"
);

const expenseForm = document.getElementById("expenseForm");
const expensesTable = document.getElementById("expensesTable");

function showExpenses() {
  expensesTable.innerHTML = "";

  expenses.forEach(expense => {
    const row = document.createElement("tr");

    [
      expense.description,
      expense.category,
      money(expense.amount),
      expense.date
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    expensesTable.appendChild(row);
  });
}

function updateNetProfit() {
  const grossProfit = sales.reduce(
    (sum, sale) => sum + sale.profit, 0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount, 0
  );

  const netProfit = grossProfit - totalExpenses;

  document.querySelectorAll(".card").forEach(card => {
    const heading = card.querySelector("h3");
    const value = card.querySelector("h2");

    if (
      heading &&
      value &&
      heading.textContent === "Net Profit"
    ) {
      value.textContent = money(netProfit);
    }
  });
}

expenseForm.addEventListener("submit", event => {
  event.preventDefault();

  const description = document
    .getElementById("expenseDescription").value.trim();

  const category = document
    .getElementById("expenseCategory").value;

  const amount = Number(
    document.getElementById("expenseAmount").value
  );

  const date = document
    .getElementById("expenseDate").value;

  if (!description || !Number.isFinite(amount) ||
      amount <= 0 || !date) {
    alert("Please enter valid expense details.");
    return;
  }

  expenses.push({
    id: crypto.randomUUID(),
    description,
    category,
    amount,
    date
  });

  localStorage.setItem(
    expensesKey,
    JSON.stringify(expenses)
  );

  showExpenses();
updateNetProfit();
updateProfitExpenseChart();
expenseForm.reset();
});

showExpenses();
updateNetProfit();

/* MONTHLY PROFIT AND EXPENSE BAR GRAPH */

let profitExpenseChart;

function updateProfitExpenseChart() {
  const canvas = document.getElementById("profitExpenseChart");

  if (!canvas || typeof Chart === "undefined") return;

  const months = [];
  const profitData = [];
  const expenseData = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    months.push(
      monthDate.toLocaleDateString("en-US", {
        month: "short"
      })
    );

    const monthlyProfit = sales
      .filter(sale => {
        const date = new Date(sale.date + "T12:00:00");
        return date.getFullYear() === year &&
               date.getMonth() === month;
      })
      .reduce((sum, sale) => sum + sale.profit, 0);

    const monthlyExpenses = expenses
      .filter(expense => {
        const date = new Date(expense.date + "T12:00:00");
        return date.getFullYear() === year &&
               date.getMonth() === month;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    profitData.push(monthlyProfit);
    expenseData.push(monthlyExpenses);
  }

  if (profitExpenseChart) {
    profitExpenseChart.destroy();
  }

  profitExpenseChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Gross Profit",
          data: profitData,
          backgroundColor: "#16a34a",
          borderRadius: 6
        },
        {
          label: "Expenses",
          data: expenseData,
          backgroundColor: "#ef4444",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => "$" + value
          }
        }
      }
    }
  });
}

updateProfitExpenseChart();

/* EDIT SALE SLIDING PANEL */

const editSaleOverlay = document.getElementById("editSaleOverlay");
const editSaleForm = document.getElementById("editSaleForm");

function closeEditSale() {
  editSaleOverlay.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("cancelEditSale").addEventListener(
  "click",
  closeEditSale
);

editSaleOverlay.addEventListener("click", event => {
  if (event.target === editSaleOverlay) {
    closeEditSale();
  }
});

editSaleForm.addEventListener("submit", event => {
  event.preventDefault();

  const saleId = document.getElementById("editSaleId").value;
  const sale = sales.find(item => item.id === saleId);

  if (!sale) {
    alert("Sale not found.");
    return;
  }

  const purchase = purchases.find(
    item => item.id === sale.purchaseId
  );

  if (!purchase) {
    alert("Original inventory purchase not found.");
    return;
  }

  const quantity = Number(
    document.getElementById("editSaleQuantity").value
  );
  const price = Number(
    document.getElementById("editSalePrice").value
  );
  const platform = document.getElementById("editSalesPlatform").value;
  const payment = document.getElementById("editPaymentMethod").value;
  const date = document.getElementById("editSaleDate").value;

  const available = remainingQuantity(purchase) + sale.quantity;

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > available ||
    !Number.isFinite(price) ||
    price < 0 ||
    !date
  ) {
    alert("Please check the sale details. Maximum quantity: " + available);
    return;
  }

  const revenue = Math.round(quantity * price * 100) / 100;
  const cost = Math.round(quantity * purchase.cost * 100) / 100;

  sale.quantity = quantity;
  sale.price = price;
  sale.salesPlatform = platform;
  sale.paymentMethod = payment;
  sale.date = date;
  sale.revenue = revenue;
  sale.cost = cost;
  sale.profit = Math.round((revenue - cost) * 100) / 100;

  localStorage.setItem(salesKey, JSON.stringify(sales));

  showSales();
  updateBatchOptions();
  updateFinancialDashboard();
  updateNetProfit();
  updateProfitExpenseChart();

  closeEditSale();
});
