// Role Check
const role = localStorage.getItem("userRole");
if (role !== "admin") {
  window.location.href = "employee-dashboard.html";
}

const events = [
  {
    name: "Company Retreat",
    pic: ["Kamarul", "Pharlatlot"],
    date: "Sept 9 - Sept 13",
    stage: "Planning",
    budget: "Review",
  },
  {
    name: "Product Launch",
    pic: ["Anthony", "Donny"],
    date: "Sept 9 - Sept 13",
    stage: "Review",
    budget: "Pending",
  },
];

// Render Events
const container = document.getElementById("eventsContainer");

events.forEach(event => {
  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <h3>${event.name}</h3>
    <p><strong>PIC:</strong> ${event.pic.join(", ")}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Stage:</strong> ${event.stage}</p>
    <p><strong>Budget:</strong> ${event.budget}</p>
  `;
  container.appendChild(card);
});

// Charts
new Chart(document.getElementById("pieChart"), {
  type: 'pie',
  data: {
    labels: ["Your Plan", "Success"],
    datasets: [{
      data: [63, 25],
      backgroundColor: ["#6C63FF", "#4BC0C0"]
    }]
  }
});

new Chart(document.getElementById("barChart"), {
  type: 'bar',
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [{
      label: 'Visitors',
      data: [500, 1000, 1500, 2579],
      backgroundColor: "#6C63FF"
    }]
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function createEvent() {
  alert("This will take you to event creation page.");
  // Redirect to create-event.html (if built)
}
