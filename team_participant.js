let currentType = 'team'; // 'team' or 'participant'
let teamData = [];
let participantData = [];
let editingIndex = -1;

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");

if (!eventId) {
  alert("Invalid Event ID");
  throw new Error("Missing Event ID in URL");
}

// Set role
if (!localStorage.getItem("role")) {
  localStorage.setItem("role", "admin");
}
let isAdmin = localStorage.getItem("role") === "admin";

// Load existing data for this event
function loadData() {
  teamData = JSON.parse(localStorage.getItem(`teamMembers_${eventId}`)) || [];
  participantData = JSON.parse(localStorage.getItem(`participants_${eventId}`)) || [];
}

function saveData() {
  localStorage.setItem(`teamMembers_${eventId}`, JSON.stringify(teamData));
  localStorage.setItem(`participants_${eventId}`, JSON.stringify(participantData));
  updateAttendanceButton();
}

function updateAttendanceButton() {
  const attendanceBtn = document.getElementById("attendanceBtn");
  const attendanceInfo = document.getElementById("attendanceInfo");
  
  if (isAdmin && (teamData.length > 0 || participantData.length > 0)) {
    attendanceBtn.style.display = "inline-flex";
    attendanceInfo.style.display = "block";
  } else {
    attendanceBtn.style.display = "none";
    attendanceInfo.style.display = "none";
  }
}

function switchType(type) {
  currentType = type;

  // Update button states
  const teamBtn = document.getElementById("teamBtn");
  const participantBtn = document.getElementById("participantBtn");
  
  if (type === 'team') {
    teamBtn.classList.add("active");
    participantBtn.classList.remove("active");
  } else {
    participantBtn.classList.add("active");
    teamBtn.classList.remove("active");
  }

  const addBtn = document.getElementById("addBtn");
  addBtn.textContent = type === 'team' ? "+ Add Member" : "+ Add Participant";
  addBtn.style.display = isAdmin ? "inline-block" : "none";

  document.getElementById("modalTitle").textContent = 
    type === 'team' ? "Add Team Member" : "Add Participant";

  renderTable();
}

function renderTable() {
  const header = document.getElementById("tableHeader");
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  if (currentType === 'team') {
    header.innerHTML = `
      <tr>
        <th>No.</th>
        <th>Name</th>
        <th>Role</th>
        <th>Task</th>
        ${isAdmin ? '<th>Actions</th>' : ''}
      </tr>`;
    
    if (teamData.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="${isAdmin ? '5' : '4'}" style="text-align: center; color: #666; padding: 20px;">
            No team members added yet. ${isAdmin ? 'Click "Add Member" to get started.' : ''}
          </td>
        </tr>`;
    } else {
      teamData.forEach((member, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${member.name}</td>
          <td>${member.role}</td>
          <td>${member.task}</td>
          ${isAdmin ? `
            <td>
              <button class="action-btn edit-btn" onclick="editMember(${i})">Edit</button>
              <button class="action-btn delete-btn" onclick="deleteMember(${i})">Delete</button>
            </td>
          ` : ''}`;
        body.appendChild(row);
      });
    }
  } else {
    header.innerHTML = `
      <tr>
        <th>No.</th>
        <th>Name</th>
        <th>Email</th>
        <th>H/P No.</th>
        ${isAdmin ? '<th>Actions</th>' : ''}
      </tr>`;
    
    if (participantData.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="${isAdmin ? '5' : '4'}" style="text-align: center; color: #666; padding: 20px;">
            No participants added yet. ${isAdmin ? 'Click "Add Participant" to get started.' : ''}
          </td>
        </tr>`;
    } else {
      participantData.forEach((participant, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${participant.name}</td>
          <td>${participant.email}</td>
          <td>${participant.phone}</td>
          ${isAdmin ? `
            <td>
              <button class="action-btn edit-btn" onclick="editParticipant(${i})">Edit</button>
              <button class="action-btn delete-btn" onclick="deleteParticipant(${i})">Delete</button>
            </td>
          ` : ''}`;
        body.appendChild(row);
      });
    }
  }

  document.getElementById("teamFields").style.display = currentType === 'team' ? "block" : "none";
  document.getElementById("participantFields").style.display = currentType === 'participant' ? "block" : "none";
}

function openAddModal() {
  if (!isAdmin) {
    alert("Permission denied. Only admins can add members.");
    return;
  }
  
  editingIndex = -1;
  clearModalFields();
  document.getElementById("modalTitle").textContent = 
    currentType === 'team' ? "Add Team Member" : "Add Participant";
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  clearModalFields();
  editingIndex = -1;
}

function saveMember() {
  if (!isAdmin) {
    alert("Permission denied. Only admins can save members.");
    return;
  }

  if (currentType === 'team') {
    const name = document.getElementById("teamName").value.trim();
    const role = document.getElementById("teamRole").value.trim();
    const task = document.getElementById("teamTask").value.trim();

    if (!name || !role || !task) {
      alert("Please fill in all fields for team member.");
      return;
    }

    if (editingIndex >= 0) {
      teamData[editingIndex] = { name, role, task };
    } else {
      teamData.push({ name, role, task });
    }
  } else {
    const name = document.getElementById("participantName").value.trim();
    const email = document.getElementById("participantEmail").value.trim();
    const phone = document.getElementById("participantPhone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill in all fields for participant.");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email format.");
      return;
    }

    if (editingIndex >= 0) {
      participantData[editingIndex] = { name, email, phone };
    } else {
      participantData.push({ name, email, phone });
    }
  }

  saveData();
  closeModal();
  renderTable();
}

function editMember(index) {
  if (!isAdmin) {
    alert("Permission denied. Only admins can edit members.");
    return;
  }
  
  editingIndex = index;
  const member = teamData[index];
  document.getElementById("teamName").value = member.name;
  document.getElementById("teamRole").value = member.role;
  document.getElementById("teamTask").value = member.task;
  document.getElementById("modalTitle").textContent = "Edit Team Member";
  document.getElementById("modal").style.display = "block";
}

function editParticipant(index) {
  if (!isAdmin) {
    alert("Permission denied. Only admins can edit participants.");
    return;
  }
  
  editingIndex = index;
  const participant = participantData[index];
  document.getElementById("participantName").value = participant.name;
  document.getElementById("participantEmail").value = participant.email;
  document.getElementById("participantPhone").value = participant.phone;
  document.getElementById("modalTitle").textContent = "Edit Participant";
  document.getElementById("modal").style.display = "block";
}

function deleteMember(index) {
  if (!isAdmin) {
    alert("Permission denied. Only admins can delete members.");
    return;
  }
  
  if (confirm("Are you sure you want to delete this team member?")) {
    teamData.splice(index, 1);
    saveData();
    renderTable();
  }
}

function deleteParticipant(index) {
  if (!isAdmin) {
    alert("Permission denied. Only admins can delete participants.");
    return;
  }
  
  if (confirm("Are you sure you want to delete this participant?")) {
    participantData.splice(index, 1);
    saveData();
    renderTable();
  }
}

function goToAttendance() {
  if (!isAdmin) {
    alert("Permission denied. Only admins can access attendance.");
    return;
  }
  
  if (teamData.length === 0 && participantData.length === 0) {
    alert("Please add team members or participants before creating attendance list.");
    return;
  }
  
  // Navigate to attendance page with event ID
  window.location.href = `attendance.html?id=${eventId}`;
}

function clearModalFields() {
  document.getElementById("teamName").value = "";
  document.getElementById("teamRole").value = "";
  document.getElementById("teamTask").value = "";
  document.getElementById("participantName").value = "";
  document.getElementById("participantEmail").value = "";
  document.getElementById("participantPhone").value = "";
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
}

window.onload = function () {
  loadData();
  switchType("team");
  updateAttendanceButton();
};