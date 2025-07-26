// Simulated event data
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
  {
    name: "Tech Conference",
    pic: ["Jane Doe", "Donny"],
    date: "Oct 1 - Oct 4",
    stage: "Execution",
    budget: "Approved",
  },
];

// Get current user (set during login)
const currentEmail = localStorage.getItem("userEmail");
const role = localStorage.getItem("userRole");

// Redirect if not employee
if (role !== "employee") {
  window.location.href = "index.html";
}

// Simulated mapping of emails to names
const emailToName = {
  "admin@mindhive.com": "Admin",
  "jane@mindhive.com": "Jane Doe",
  "john@mindhive.com": "John",
};

const userName = emailToName[currentEmail];

// Filter events where user is a PIC
const userEvents = events.filter(event =>
  event.pic.includes(userName)
);

// Render filtered events
const container = document.getElementById("eventsContainer");

if (userEvents.length === 0) {
  container.innerHTML = `<p>No current events assigned to you.</p>`;
} else {
  userEvents.forEach(event => {
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
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
