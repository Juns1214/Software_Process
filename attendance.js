document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  const currentUserRole = localStorage.getItem("currentUserRole") || "admin";

  const teamTableBody = document.getElementById("teamMemberBody");
  const participantTableBody = document.getElementById("participantBody");
  const teamTable = document.getElementById("teamMemberTable");
  const participantTable = document.getElementById("participantTable");

  const modal = document.getElementById("addModal");
  const addForm = document.getElementById("addForm");
  const teamFields = document.getElementById("teamFields");
  const participantFields = document.getElementById("participantFields");
  const modalTitle = document.getElementById("modalTitle");

  let currentMode = "team";
  let editingIndex = -1;

  if (!eventId) {
    alert("Invalid Event ID");
    return;
  }

  const teamList = JSON.parse(localStorage.getItem(`teamMembers_${eventId}`)) || [];
  const participantList = JSON.parse(localStorage.getItem(`participants_${eventId}`)) || [];

  function saveTeamList() {
    localStorage.setItem(`teamMembers_${eventId}`, JSON.stringify(teamList));
    console.log("Team list saved:", teamList);
  }

  function saveParticipantList() {
    localStorage.setItem(`participants_${eventId}`, JSON.stringify(participantList));
    console.log("Participant list saved:", participantList);
  }

  function renderTeamTable() {
    teamTableBody.innerHTML = "";
    teamList.forEach((member, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.role}</td>
        <td>${member.task}</td>
        <td>
            <input type="checkbox" ${member.attendance ? "checked" : ""} onchange="toggleTeamAttendance(${index})">
        </td>
        <td>
            ${currentUserRole === "admin"
            ? `<button class="action-btn edit-btn" onclick="editTeamMember(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteTeam(${index})">Delete</button>`
            : `<span>N/A</span>`}
        </td>
        `;
        teamTableBody.appendChild(row);
    });
  }

  function renderParticipantTable() {
    participantTableBody.innerHTML = "";
    participantList.forEach((p, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.phone}</td>
        <td>
            <input type="checkbox" ${p.attendance ? "checked" : ""} onchange="toggleParticipantAttendance(${index})">
        </td>
        <td>
            ${currentUserRole === "admin"
            ? `<button class="action-btn edit-btn" onclick="editParticipant(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteParticipant(${index})">Delete</button>`
            : `<span>N/A</span>`}
        </td>
        `;
        participantTableBody.appendChild(row);
    });
  }

  // Switch between team and participant views
  window.switchView = (type) => {
    currentMode = type;
    
    const teamBtn = document.getElementById("teamBtn");
    const participantBtn = document.getElementById("participantBtn");
    
    if (type === "team") {
      teamTable.style.display = "block";
      participantTable.style.display = "none";
      teamBtn.classList.add("active");
      participantBtn.classList.remove("active");
    } else {
      teamTable.style.display = "none";
      participantTable.style.display = "block";
      participantBtn.classList.add("active");
      teamBtn.classList.remove("active");
    }
  };

  // Modal functions
  window.openAddModal = (type) => {
    if (currentUserRole !== "admin") {
      alert("Permission denied. Only admins can add members.");
      return;
    }
    
    currentMode = type;
    editingIndex = -1;
    clearModalFields();
    
    if (type === "team") {
      modalTitle.textContent = "Add Team Member";
      teamFields.style.display = "block";
      participantFields.style.display = "none";
    } else {
      modalTitle.textContent = "Add Participant";
      teamFields.style.display = "none";
      participantFields.style.display = "block";
    }
    modal.style.display = "block";
  };

  window.closeModal = () => {
    modal.style.display = "none";
    clearModalFields();
    editingIndex = -1;
    console.log("Modal closed, editingIndex reset");
  };

  // Edit functions
  window.editTeamMember = (index) => {
    if (currentUserRole !== "admin") {
      alert("Permission denied. Only admins can edit members.");
      return;
    }
    
    editingIndex = index;
    const member = teamList[index];
    
    document.getElementById("teamName").value = member.name;
    document.getElementById("teamRole").value = member.role;
    document.getElementById("teamTask").value = member.task;
    
    modalTitle.textContent = "Edit Team Member";
    teamFields.style.display = "block";
    participantFields.style.display = "none";
    currentMode = "team";
    modal.style.display = "block";
  };

  window.editParticipant = (index) => {
    if (currentUserRole !== "admin") {
      alert("Permission denied. Only admins can edit participants.");
      return;
    }
    
    editingIndex = index;
    const participant = participantList[index];
    
    document.getElementById("participantName").value = participant.name;
    document.getElementById("participantEmail").value = participant.email;
    document.getElementById("participantPhone").value = participant.phone;
    
    modalTitle.textContent = "Edit Participant";
    teamFields.style.display = "none";
    participantFields.style.display = "block";
    currentMode = "participant";
    modal.style.display = "block";
  };

  // Update functions
  window.updateTeam = (index, field, value) => {
    if (currentUserRole !== "admin") return;
    teamList[index][field] = value.trim();
    saveTeamList();
  };

  window.updateParticipant = (index, field, value) => {
    if (currentUserRole !== "admin") return;
    participantList[index][field] = value.trim();
    saveParticipantList();
  };

  // Attendance toggle functions
  window.toggleTeamAttendance = (index) => {
    teamList[index].attendance = !teamList[index].attendance;
    saveTeamList();
  };

  window.toggleParticipantAttendance = (index) => {
    participantList[index].attendance = !participantList[index].attendance;
    saveParticipantList();
  };

  // Delete functions with confirmation
  window.deleteTeam = (index) => {
    if (currentUserRole !== "admin") {
      alert("Permission denied. Only admins can delete members.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this team member?")) {
      teamList.splice(index, 1);
      saveTeamList();
      renderTeamTable();
    }
  };

  window.deleteParticipant = (index) => {
    if (currentUserRole !== "admin") {
      alert("Permission denied. Only admins can delete participants.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this participant?")) {
      participantList.splice(index, 1);
      saveParticipantList();
      renderParticipantTable();
    }
  };

  // Clear modal fields
  function clearModalFields() {
    document.getElementById("teamName").value = "";
    document.getElementById("teamRole").value = "";
    document.getElementById("teamTask").value = "";
    document.getElementById("participantName").value = "";
    document.getElementById("participantEmail").value = "";
    document.getElementById("participantPhone").value = "";
  }

  // Form submission - Fixed version
  addForm.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submitted, currentMode:", currentMode, "editingIndex:", editingIndex);

    try {
      if (currentMode === "team") {
        const nameField = document.getElementById("teamName");
        const roleField = document.getElementById("teamRole");
        const taskField = document.getElementById("teamTask");
        
        if (!nameField || !roleField || !taskField) {
          console.error("Team form fields not found");
          alert("Form fields not found. Please refresh the page and try again.");
          return;
        }

        const name = nameField.value.trim();
        const role = roleField.value.trim();
        const task = taskField.value.trim();

        console.log("Team form data:", { name, role, task });

        if (!name || !role || !task) {
          alert("Please fill in all fields for team member.");
          return;
        }

        if (editingIndex >= 0) {
          // Edit existing member
          teamList[editingIndex].name = name;
          teamList[editingIndex].role = role;
          teamList[editingIndex].task = task;
          console.log("Updated team member at index", editingIndex);
        } else {
          // Add new member
          const newMember = { name, role, task, attendance: false };
          teamList.push(newMember);
          console.log("Added new team member:", newMember);
        }
        saveTeamList();
        renderTeamTable();
        
      } else if (currentMode === "participant") {
        const nameField = document.getElementById("participantName");
        const emailField = document.getElementById("participantEmail");
        const phoneField = document.getElementById("participantPhone");
        
        if (!nameField || !emailField || !phoneField) {
          console.error("Participant form fields not found");
          alert("Form fields not found. Please refresh the page and try again.");
          return;
        }

        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const phone = phoneField.value.trim();

        console.log("Participant form data:", { name, email, phone });

        if (!name || !email || !phone) {
          alert("Please fill in all fields for participant.");
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("Invalid email format.");
          return;
        }

        if (editingIndex >= 0) {
          // Edit existing participant
          participantList[editingIndex].name = name;
          participantList[editingIndex].email = email;
          participantList[editingIndex].phone = phone;
          console.log("Updated participant at index", editingIndex);
        } else {
          // Add new participant
          const newParticipant = { name, email, phone, attendance: false };
          participantList.push(newParticipant);
          console.log("Added new participant:", newParticipant);
        }
        saveParticipantList();
        renderParticipantTable();
      }

      console.log("Closing modal and resetting form");
      closeModal();
      
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("An error occurred while saving. Please try again.");
    }
  });

  // Close modal when clicking outside
  window.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };

  // Initialize
  renderTeamTable();
  renderParticipantTable();
  switchView("team"); // Start with team view
});