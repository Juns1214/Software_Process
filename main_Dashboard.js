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
          legend: { position: 'top' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });

    addBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("eventName").value;
      const pic = document.getElementById("eventPIC").value;
      const date = document.getElementById("eventDate").value;
      const stage = document.getElementById("eventStage").value;
      const budget = document.getElementById("eventBudget").value;
      const eventId = Date.now(); // Unique ID

      const newEvent = { id: eventId, name, pic, date, stage, budget };

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

      const cardHTML = `
        <div class="event-card" data-id="${event.id}">
            ${role === "admin" ? `<i class="fas fa-trash trash-icon" title="Delete Event"></i>` : ""}
            <h3><a href="base_Event_Detail.html?id=${event.id}" target="_blank">${event.name}</a></h3>
            <p><strong>PIC:</strong> ${event.pic}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Stage:</strong> <span class="tag ${stageClass}">${capitalize(event.stage)}</span></p>
            <p><strong>Budget:</strong> <span class="tag ${budgetClass}">${capitalize(event.budget)}</span></p>
        </div>`;

      eventList.insertAdjacentHTML("beforeend", cardHTML);
    });

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