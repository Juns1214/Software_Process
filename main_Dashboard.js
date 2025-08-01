document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole") || "employee";
  const modal = document.getElementById("eventModal");
  const addBtn = document.getElementById("addEventBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("eventForm");
  const eventList = document.querySelector(".event-list");
  
  // Date type handling
  const dateTypeSelect = document.getElementById("dateType");
  const singleDateContainer = document.getElementById("singleDateContainer");
  const dateRangeContainer = document.getElementById("dateRangeContainer");

  // Hide sections for employee
  if (role === "employee") {
    document.getElementById("pastEventLink").style.display = "none";
    document.getElementById("teamLink").style.display = "none";
    document.getElementById("addEventBtn").style.display = "none";
  }

  // Date type change handler
  if (dateTypeSelect) {
    dateTypeSelect.addEventListener("change", () => {
      const dateType = dateTypeSelect.value;
      if (dateType === "single") {
        singleDateContainer.style.display = "block";
        dateRangeContainer.style.display = "none";
        // Clear range inputs
        document.getElementById("eventStartDate").value = "";
        document.getElementById("eventEndDate").value = "";
      } else {
        singleDateContainer.style.display = "none";
        dateRangeContainer.style.display = "block";
        // Clear single date input
        document.getElementById("eventDate").value = "";
      }
    });
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

      const dateType = document.getElementById("dateType").value;
      let dateData = {};

      if (dateType === "single") {
        const singleDate = document.getElementById("eventDate").value;
        if (!singleDate) {
          alert("Please select a date.");
          return;
        }
        dateData = {
          type: "single",
          date: singleDate
        };
      } else {
        const startDate = document.getElementById("eventStartDate").value;
        const endDate = document.getElementById("eventEndDate").value;
        if (!startDate || !endDate) {
          alert("Please select both start and end dates.");
          return;
        }
        if (new Date(startDate) > new Date(endDate)) {
          alert("Start date cannot be after end date.");
          return;
        }
        dateData = {
          type: "range",
          startDate: startDate,
          endDate: endDate
        };
      }

      const stage = document.getElementById("eventStage").value;
      const budget = document.getElementById("eventBudget").value;
      const eventId = Date.now(); // Unique ID

      const newEvent = {
        id: eventId,
        name,
        pics: picArray,
        dateData: dateData, // Store complete date information
        // Keep legacy date field for backward compatibility
        date: dateType === "single" ? dateData.date : `${dateData.startDate} to ${dateData.endDate}`,
        stage,
        budget
      };

      const events = JSON.parse(localStorage.getItem("events") || "[]");
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));

      renderEvents();
      form.reset();
      // Reset date type to single
      dateTypeSelect.value = "single";
      singleDateContainer.style.display = "block";
      dateRangeContainer.style.display = "none";
      modal.style.display = "none";
    });
  }

  function formatDateDisplay(event) {
    // Check if event has new dateData structure
    if (event.dateData) {
      if (event.dateData.type === "single") {
        return event.dateData.date;
      } else {
        return `${event.dateData.startDate} to ${event.dateData.endDate}`;
      }
    }
    // Fallback to legacy date field
    return event.date || "N/A";
  }

  function renderEvents() {
    eventList.innerHTML = "";
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    events.forEach(event => {
      const stageClass = event.stage;
      const budgetClass = event.budget;

      // Handle both new and old data structures
      let picList = "N/A";
      if (Array.isArray(event.pics)) {
        picList = event.pics.join(", ");
      } else if (typeof event.pic === "string") {
        picList = event.pic;
      }

      const dateDisplay = formatDateDisplay(event);

      const cardHTML = `
        <div class="event-card" data-id="${event.id}">
            ${role === "admin" ? `<i class="fas fa-trash trash-icon" title="Delete Event"></i>` : ""}
            <h3><a href="base_Event_Detail.html?id=${event.id}" target="_blank">${event.name}</a></h3>
            <p><strong>PIC:</strong> ${picList}</p>
            <p><strong>Date:</strong> ${dateDisplay}</p>
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