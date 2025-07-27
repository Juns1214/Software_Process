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

// Render PIC names
function renderPICList() {
  const picListEl = document.getElementById("picList");
  picListEl.innerHTML = "";
  const pics = event.pics || [];
  pics.forEach(picName => {
    const div = document.createElement("div");
    div.className = "pic-item";
    div.textContent = picName;
    picListEl.appendChild(div);
  });
}

// Render milestones
function renderMilestones() {
  milestoneList.innerHTML = "";
  event.milestones.forEach((m, idx) => {
    const item = document.createElement("li");
    item.className = `milestone-item ${m.completed ? "completed" : ""}`;
    item.textContent = `${m.name} (Finish by: ${m.date})`;
    if (role === "admin") {
      item.addEventListener("click", () => {
        m.completed = !m.completed;
        saveEvent();
        renderMilestones();
      });
    }
    milestoneList.appendChild(item);
  });
}

// Show main edit modal
editBtn.addEventListener("click", () => {
  document.getElementById("editName").value = event.name || "";
  document.getElementById("editDesc").value = event.description || "";
  document.getElementById("editPICs").value = (event.pics || []).join(", ");
  document.getElementById("editDate").value = event.date || "";
  modal.classList.remove("hidden");
});

function closeModal() {
  modal.classList.add("hidden");
}

function saveEventDetails() {
  event.name = document.getElementById("editName").value;
  event.description = document.getElementById("editDesc").value;
  event.pics = document.getElementById("editPICs").value.split(",").map(s => s.trim()).filter(Boolean);
  event.date = document.getElementById("editDate").value;
  saveEvent();
  loadEventDetails();
  closeModal();
}

// Budget Modal Event Listeners
budgetEditBtn.addEventListener("click", () => {
  const b = event.budgetData;
  document.getElementById("actualExpenseInput").value = b.actualExpense;
  document.getElementById("expectedExpenseInput").value = b.expectedExpense;
  document.getElementById("actualIncomeInput").value = b.actualIncome;
  document.getElementById("expectedIncomeInput").value = b.expectedIncome;
  budgetModal.classList.remove("hidden");
});

document.getElementById("saveBudgetBtn").addEventListener("click", () => {
  const b = event.budgetData;

  const actualExpenseInput = document.getElementById("actualExpenseInput").value;
  const expectedExpenseInput = document.getElementById("expectedExpenseInput").value;
  const actualIncomeInput = document.getElementById("actualIncomeInput").value;
  const expectedIncomeInput = document.getElementById("expectedIncomeInput").value;

  if (actualExpenseInput !== "") b.actualExpense = parseFloat(actualExpenseInput) || 0;
  if (expectedExpenseInput !== "") b.expectedExpense = parseFloat(expectedExpenseInput) || 0;
  if (actualIncomeInput !== "") b.actualIncome = parseFloat(actualIncomeInput) || 0;
  if (expectedIncomeInput !== "") b.expectedIncome = parseFloat(expectedIncomeInput) || 0;

  saveEvent();
  renderBudgetProgress();
  budgetModal.classList.add("hidden");
});

document.getElementById("closeBudgetModal").addEventListener("click", () => {
  budgetModal.classList.add("hidden");
});

// Milestone Modal Event Listeners
addMilestoneBtn.addEventListener("click", () => {
  // Clear previous values
  document.getElementById("milestoneName").value = "";
  document.getElementById("milestoneDate").value = "";
  milestoneModal.classList.remove("hidden");
});

document.getElementById("saveMilestoneBtn").addEventListener("click", () => {
  const name = document.getElementById("milestoneName").value.trim();
  const date = document.getElementById("milestoneDate").value;
  
  if (name && date) {
    event.milestones.push({ name, date, completed: false });
    saveEvent();
    renderMilestones();
    milestoneModal.classList.add("hidden");
  } else {
    alert("Please enter both milestone name and date.");
  }
});

document.getElementById("closeMilestoneModal").addEventListener("click", () => {
  milestoneModal.classList.add("hidden");
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === budgetModal) {
    budgetModal.classList.add("hidden");
  }
  if (e.target === milestoneModal) {
    milestoneModal.classList.add("hidden");
  }
  if (e.target === modal) {
    closeModal();
  }
});

function renderBudgetProgress() {
  const b = event.budgetData;
  const expPercent = b.expectedExpense > 0 ? (b.actualExpense / b.expectedExpense) * 100 : 0;
  const incPercent = b.expectedIncome > 0 ? (b.actualIncome / b.expectedIncome) * 100 : 0;

  // Fixed the element IDs to match HTML
  document.getElementById("actualExpenseLabel").textContent = `Actual: RM${b.actualExpense}`;
  document.getElementById("expectedExpenseLabel").textContent = `Expected: RM${b.expectedExpense}`;
  document.getElementById("expenseBar").value = Math.min(expPercent, 100);

  document.getElementById("actualIncomeLabel").textContent = `Actual: RM${b.actualIncome}`;
  document.getElementById("expectedIncomeLabel").textContent = `Expected: RM${b.expectedIncome}`;
  document.getElementById("incomeBar").value = Math.min(incPercent, 100);
}

function saveEvent() {
  const index = events.findIndex(e => e.id == eventId);
  if (index !== -1) {
    events[index] = event;
    localStorage.setItem("events", JSON.stringify(events));
  }
}

// Set navigation links
document.getElementById("teamParticipantBtn").href = `team_participant.html?id=${eventId}`;
document.getElementById("attendanceBtn").href = `attendance.html?id=${eventId}`;

// Initialize - make sure modals are hidden on load
window.addEventListener("DOMContentLoaded", () => {
  // Ensure all modals are hidden initially
  if (budgetModal) budgetModal.classList.add("hidden");
  if (milestoneModal) milestoneModal.classList.add("hidden");
  if (modal) modal.classList.add("hidden");
  
  loadEventDetails();
});

// === TASK SECTION ===
const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskBody = document.getElementById("taskBody");

const taskNameInput = document.getElementById("taskNameInput");
const taskAssignedInput = document.getElementById("taskAssignedInput");
const taskDeadlineInput = document.getElementById("taskDeadlineInput");
const taskStatusInput = document.getElementById("taskStatusInput");
const saveTaskBtn = document.getElementById("saveTaskBtn");

let editingTaskIndex = null;

// Initialize empty tasks if missing
if (!event.tasks) event.tasks = [];

function renderTasks() {
  taskBody.innerHTML = "";
  event.tasks.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${task.name}</td>
      <td>${task.assignedTo}</td>
      <td>${task.deadline}</td>
      <td>${task.status}</td>
      ${role === "admin" ? `
      <td class="admin-only">
        <button onclick="editTask(${index})">Edit</button>
      </td>` : ""}
    `;

    taskBody.appendChild(row);
  });
}

function openTaskModal() {
  taskNameInput.value = "";
  taskAssignedInput.value = "";
  taskDeadlineInput.value = "";
  taskStatusInput.value = "Pending";
  editingTaskIndex = null;
  document.getElementById("taskModalTitle").textContent = "Add Task";
  taskModal.classList.remove("hidden");
}

function editTask(index) {
  const task = event.tasks[index];
  taskNameInput.value = task.name;
  taskAssignedInput.value = task.assignedTo;
  taskDeadlineInput.value = task.deadline;
  taskStatusInput.value = task.status;
  editingTaskIndex = index;
  document.getElementById("taskModalTitle").textContent = "Edit Task";
  taskModal.classList.remove("hidden");
}

function closeTaskModal() {
  taskModal.classList.add("hidden");
}

saveTaskBtn.addEventListener("click", () => {
  const name = taskNameInput.value.trim();
  const assignedTo = taskAssignedInput.value.trim();
  const deadline = taskDeadlineInput.value;
  const status = taskStatusInput.value;

  if (!name || !assignedTo || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const taskObj = { name, assignedTo, deadline, status };

  if (editingTaskIndex !== null) {
    event.tasks[editingTaskIndex] = taskObj;
  } else {
    event.tasks.push(taskObj);
  }

  saveEvent(); // Save to localStorage
  renderTasks(); // Refresh display
  closeTaskModal(); // Close popup
});

// Hook up +Add button
addTaskBtn.addEventListener("click", openTaskModal);

// Hide add button and action column for employees
if (role !== "admin") {
  addTaskBtn.style.display = "none";
  document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
}

// Call once on page load
window.addEventListener("DOMContentLoaded", renderTasks);
