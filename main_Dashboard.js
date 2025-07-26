document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole") || "employee";

  // Hide restricted links for employee
  if (role === "employee") {
    document.getElementById("pastEventLink").style.display = "none";
    document.getElementById("teamLink").style.display = "none";
  }

  // Show admin-only content
  if (role === "admin") {
    document.getElementById("adminSection").style.display = "flex";

    const ctx = document.getElementById("profitExpenseChart").getContext("2d");

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Q1", "Q2", "Q3"],
        datasets: [
          {
            label: "Profit (RM)",
            data: [120000, 135000, 78000],
            backgroundColor: "rgba(54, 162, 235, 0.7)"
          },
          {
            label: "Expense (RM)",
            data: [90000, 100000, 67000],
            backgroundColor: "rgba(255, 99, 132, 0.7)"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Company Financial Overview (2025)",
            font: { size: 18 }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
