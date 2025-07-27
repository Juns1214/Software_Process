let currentType = 'team'; // 'team' or 'participant'
let teamData = [];
let participantData = [];
let editingIndex = -1;

// Get role from localStorage (using same pattern as your other files)
const role = localStorage.getItem("userRole") || "employee";
const isAdmin = role === "admin";

function switchType(type) {
  currentType = type;
  
  // Update button text based on type
  const addBtn = document.getElementById("addBtn");
  if (type === 'team') {
    addBtn.textContent = "+ Add Member";
    addBtn.style.display = isAdmin ? "inline-block" : "none";
  } else {
    addBtn.textContent = "+ Add Participant";
    addBtn.style.display = isAdmin ? "inline-block" : "none"; // Admin control for participants too
  }
  
  // Update modal title
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
  } else {
    header.innerHTML = `
      <tr>
        <th>No.</th>
        <th>Name</th>
        <th>Email</th>
        <th>H/P No.</th>
        ${isAdmin ? '<th>Actions</th>' : ''}
      </tr>`;
      
    participantData.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.phone}</td>
        ${isAdmin ? `
          <td>
            <button class="action-btn edit-btn" onclick="editParticipant(${i})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteParticipant(${i})">Delete</button>
          </td>
        ` : ''}`;
      body.appendChild(row);
    });
  }

  // Show/hide appropriate form fields in modal
  document.getElementById("teamFields").style.display = currentType === 'team' ? "block" : "none";
  document.getElementById("participantFields").style.display = currentType === 'participant' ? "block" : "none";
}

function openAddModal() {
  if (!isAdmin) {
    alert("You don't have permission to add members or participants.");
    return;
  }
  
  editingIndex = -1;
  clearModalFields();
  
  // Update modal title based on current type and action
  document.getElementById("modalTitle").textContent = 
    currentType === 'team' ? "Add Team Member" : "Add Participant";
    
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  clearModalFields();
}

function saveMember() {
  if (!isAdmin && editingIndex === -1) {
    alert("You don't have permission to add new entries.");
    return;
  }

  if (currentType === 'team') {
    const name = document.getElementById("teamName").value.trim();
    const role = document.getElementById("teamRole").value.trim();
    const task = document.getElementById("teamTask").value.trim();

    // Basic validation
    if (!name || !role || !task) {
      alert("Please fill in all fields for team member.");
      return;
    }

    if (editingIndex >= 0) {
      // Editing existing member
      teamData[editingIndex] = { name, role, task };
    } else {
      // Adding new member
      teamData.push({ name, role, task });
    }
  } else {
    const name = document.getElementById("participantName").value.trim();
    const email = document.getElementById("participantEmail").value.trim();
    const phone = document.getElementById("participantPhone").value.trim();
    
    // Basic validation
    if (!name || !email || !phone) {
      alert("Please fill in all fields for participant.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (editingIndex >= 0) {
      // Editing existing participant
      participantData[editingIndex] = { name, email, phone };
    } else {
      // Adding new participant
      participantData.push({ name, email, phone });
    }
  }

  closeModal();
  renderTable();
}

function editMember(index) {
  if (!isAdmin) {
    alert("You don't have permission to edit members.");
    return;
  }
  
  editingIndex = index;
  const member = teamData[index];
  
  // Populate form fields
  document.getElementById("teamName").value = member.name;
  document.getElementById("teamRole").value = member.role;
  document.getElementById("teamTask").value = member.task;
  
  // Update modal title for editing
  document.getElementById("modalTitle").textContent = "Edit Team Member";
  
  document.getElementById("modal").style.display = "block";
}

function editParticipant(index) {
  if (!isAdmin) {
    alert("You don't have permission to edit participants.");
    return;
  }
  
  editingIndex = index;
  const participant = participantData[index];
  
  // Populate form fields
  document.getElementById("participantName").value = participant.name;
  document.getElementById("participantEmail").value = participant.email;
  document.getElementById("participantPhone").value = participant.phone;
  
  // Update modal title for editing
  document.getElementById("modalTitle").textContent = "Edit Participant";
  
  // Switch to participant view and show modal
  currentType = 'participant';
  document.getElementById("teamFields").style.display = "none";
  document.getElementById("participantFields").style.display = "block";
  
  document.getElementById("modal").style.display = "block";
}

function deleteMember(index) {
  if (!isAdmin) {
    alert("You don't have permission to delete members.");
    return;
  }
  
  if (confirm("Are you sure you want to delete this team member?")) {
    teamData.splice(index, 1);
    renderTable();
  }
}

function deleteParticipant(index) {
  if (!isAdmin) {
    alert("You don't have permission to delete participants.");
    return;
  }
  
  if (confirm("Are you sure you want to delete this participant?")) {
    participantData.splice(index, 1);
    renderTable();
  }
}

function clearModalFields() {
  // Clear all form fields
  document.getElementById("teamName").value = "";
  document.getElementById("teamRole").value = "";
  document.getElementById("teamTask").value = "";
  document.getElementById("participantName").value = "";
  document.getElementById("participantEmail").value = "";
  document.getElementById("participantPhone").value = "";
}

// Add some sample data for testing
function loadSampleData() {
  teamData = [
    { name: "John Doe", role: "Project Manager", task: "Project Planning & Coordination" },
    { name: "Jane Smith", role: "Developer", task: "Frontend Development" },
    { name: "Mike Johnson", role: "Designer", task: "UI/UX Design" }
  ];
  
  participantData = [
    { name: "Alice Brown", email: "alice@example.com", phone: "012-345-6789" },
    { name: "Bob Wilson", email: "bob@example.com", phone: "012-987-6543" },
    { name: "Carol Davis", email: "carol@example.com", phone: "012-555-1234" }
  ];
}

// Initialize on page load
window.onload = function () {
  // Load sample data for demonstration
  loadSampleData();
  
  // Default to team view
  switchType("team");
  
  // Console log for debugging
  console.log("Page loaded");
  console.log("Current role:", localStorage.getItem("userRole"));
  console.log("Is Admin:", isAdmin);
};