document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole") || "employee";
  const modal = document.getElementById("eventModal");
  const addBtn = document.getElementById("addEventBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("eventForm");
  const eventList = document.querySelector(".event-list");

  // Hide sections for employee
  if (role === "employee") {
    document.getElementById("pastEventLink").style.display = "none";
    document.getElementById("teamLink").style.display = "none";
    document.getElementById("addEventBtn").style.display = "none";
  }

  // Admin-only logic
  if (role === "admin") {
    document.getElementById("adminSection").style.display = "flex";
    document.getElementById("addEventBtn").style.display = "inline-block";

    const ctx = document.getElementById("profitExpenseChart")?.getContext("2d");
    if (ctx) {
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
            legend: { position: 'top' }
          },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    // Show modal
    addBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };

    // Handle form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("eventName").value;
      const picInput = document.getElementById("eventPIC").value;
      const picArray = picInput
        .split(",")
        .map(p => p.trim())
        .filter(Boolean);

      const date = document.getElementById("eventDate").value;
      const stage = document.getElementById("eventStage").value;
      const budget = document.getElementById("eventBudget").value;
      const eventId = Date.now(); // Unique ID

      const newEvent = {
        id: eventId,
        name,
        pics: picArray, // ✅ use 'pics' for compatibility
        date,
        stage,
        budget
      };

      const events = JSON.parse(localStorage.getItem("events") || "[]");
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));

      renderEvents();
      form.reset();
      modal.style.display = "none";
    });
  }

  function renderEvents() {
    eventList.innerHTML = "";
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    events.forEach(event => {
      const stageClass = event.stage;
      const budgetClass = event.budget;

      // ✅ Handle both new and old data structures
      let picList = "N/A";
      if (Array.isArray(event.pics)) {
        picList = event.pics.join(", ");
      } else if (typeof event.pic === "string") {
        picList = event.pic;
      }

    const cardHTML = `
        <div class="event-card" data-id="${event.id}">
            ${role === "admin" ? `<i class="fas fa-trash trash-icon" title="Delete Event"></i>` : ""}
            <h3><a href="base_Event_Detail.html?id=${event.id}" target="_blank">${event.name}</a></h3>
            <p><strong>PIC:</strong> ${picList}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Stage:</strong> <span class="tag ${stageClass}">${capitalize(event.stage)}</span></p>
            <p><strong>Budget:</strong> <span class="tag ${budgetClass}">${capitalize(event.budget)}</span></p>
            <div class="event-links">
            </div>
        </div>`;

      eventList.insertAdjacentHTML("beforeend", cardHTML);
    });

    // Admin delete
    if (role === "admin") {
      document.querySelectorAll(".trash-icon").forEach(icon => {
        icon.addEventListener("click", (e) => {
          const card = e.target.closest(".event-card");
          const id = parseInt(card.dataset.id);
          const confirmed = confirm("Are you sure you want to delete this event?");
          if (confirmed) {
            let events = JSON.parse(localStorage.getItem("events") || "[]");
            events = events.filter(event => event.id !== id);
            localStorage.setItem("events", JSON.stringify(events));
            renderEvents();
          }
        });
      });
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  renderEvents();
});

// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");

let events = JSON.parse(localStorage.getItem("events") || "[]");
let event = events.find(e => e.id == eventId);

// Get user role
const role = localStorage.getItem("userRole") || "employee";

// DOM Elements
const eventTitle = document.getElementById("eventTitle");
const eventDescription = document.getElementById("eventDescription");
const editBtn = document.getElementById("editEventBtn");
const modal = document.getElementById("editModal");
const milestoneList = document.getElementById("milestoneList");
const budgetEditBtn = document.getElementById("editBudgetBtn");
const budgetModal = document.getElementById("budgetModal");
const milestoneModal = document.getElementById("milestoneModal");
const addMilestoneBtn = document.getElementById("addMilestoneBtn");

// Hide admin-only buttons from employees
if (role !== "admin") {
  editBtn.style.display = "none";
  budgetEditBtn.style.display = "none";
  addMilestoneBtn.style.display = "none";
}

// Load event details
function loadEventDetails() {
  if (!event) {
    document.body.innerHTML = "<p>Event not found.</p>";
    return;
  }

  eventTitle.textContent = event.name || "Event Name";
  eventDescription.textContent = event.description || "About event";

  if (!event.pics && event.pic) {
    event.pics = [event.pic];
  }

  document.getElementById("eventDate").textContent = event.date || "N/A";

  if (!event.milestones) event.milestones = [];
  if (!event.budgetData) {
    event.budgetData = {
      actualExpense: 0,
      expectedExpense: 0,
      actualIncome: 0,
      expectedIncome: 0
    };
  }

  renderPICList();
  renderMilestones();
  renderBudgetProgress();
}