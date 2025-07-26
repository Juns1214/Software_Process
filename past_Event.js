// Chart Data Setup
const ctx = document.getElementById("mainBarChart").getContext("2d");
const barChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4",
      "2025 Q1", "2025 Q2", "2025 Q3"
    ],
    datasets: [
      {
        label: "Profit (RM)",
        backgroundColor: "#4caf50",
        data: [85000, 72000, 96000, 134000, 88000, 112000, 63000],
      },
      {
        label: "Expense (RM)",
        backgroundColor: "#f44336",
        data: [70000, 64000, 80000, 91000, 67000, 85000, 53000],
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20000 }
      }
    }
  }
});

// Quarterly Summary Setup
const quarterlySummary = document.querySelector(".quarterly-summary ul");
const highlights = [
  "2024 Q1: Cross-state seminar launch",
  "2024 Q4: Record high revenue from KL Expo",
  "2025 Q2: Major sponsor secured (RM 80K)"
];
quarterlySummary.innerHTML = highlights.map(item => `<li>${item}</li>`).join("");

// Sample Past Events
const pastEvents = [
  {
    name: "Penang Tech Fair",
    pic: "Farah Izzati",
    date: "2024-01-20",
    stage: "Completed",
    budget: "Under Budget"
  },
  {
    name: "Selangor Innovation Showcase",
    pic: "Tan Wei Sheng",
    date: "2024-04-14",
    stage: "Completed",
    budget: "Over Budget"
  },
  {
    name: "Borneo Business Forum",
    pic: "Aiman Zulkifli",
    date: "2024-07-10",
    stage: "Completed",
    budget: "On Budget"
  },
  {
    name: "KL Startup Meetup",
    pic: "Nurul Hana",
    date: "2024-10-03",
    stage: "Completed",
    budget: "Under Budget"
  },
  {
    name: "Cyberjaya Tech Week",
    pic: "Arvind Raj",
    date: "2025-02-19",
    stage: "Completed",
    budget: "Slightly Over"
  },
  {
    name: "Johor SME Expo",
    pic: "Melissa Ong",
    date: "2025-06-09",
    stage: "Completed",
    budget: "Under Budget"
  }
];

// Render Past Events
const container = document.getElementById("eventCards");
pastEvents.forEach((event) => {
  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <h3>${event.name}</h3>
    <p><strong>PIC:</strong> ${event.pic}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Stage:</strong> ${event.stage}</p>
    <p><strong>Budget Status:</strong> ${event.budget}</p>
  `;
  container.appendChild(card);
});
