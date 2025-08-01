document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  const currentUserRole = localStorage.getItem("currentUserRole") || "admin";

  const teamTableBody = document.getElementById("teamMemberBody");
  const participantTableBody = document.getElementById("participantBody");
  const teamTable = document.getElementById("teamMemberTable");
  const participantTable = document.getElementById("participantTable");
  const dateInput = document.getElementById("attendanceDate");
  const selectedDateDisplay = document.getElementById("selectedDateDisplay");
  const summaryDate = document.getElementById("summaryDate");

  let currentMode = "team";
  let currentDate = new Date().toISOString().split('T')[0]; // Today's date

  if (!eventId) {
    alert("Invalid Event ID");
    return;
  }

  // Load team and participant data
  const teamList = JSON.parse(localStorage.getItem(`teamMembers_${eventId}`)) || [];
  const participantList = JSON.parse(localStorage.getItem(`participants_${eventId}`)) || [];

  // Check if there's any data
  if (teamList.length === 0 && participantList.length === 0) {
    alert("No team members or participants found. Please add them first.");
    goBack();
    return;
  }

  // Initialize date
  dateInput.value = currentDate;
  updateDateDisplay();

  // Load attendance data for current date
  function loadAttendanceData() {
    const attendanceKey = `attendance_${eventId}_${currentDate}`;
    const attendanceData = JSON.parse(localStorage.getItem(attendanceKey)) || {
      team: {},
      participants: {}
    };
    return attendanceData;
  }

  // Save attendance data for current date
  function saveAttendanceData(attendanceData) {
    const attendanceKey = `attendance_${eventId}_${currentDate}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData));
    console.log(`Attendance saved for ${currentDate}:`, attendanceData);
  }

  // Update date display
  function updateDateDisplay() {
    const dateObj = new Date(currentDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    selectedDateDisplay.textContent = `Attendance for ${formattedDate}`;
    summaryDate.textContent = formattedDate;
  }

  // Change date handler
  window.changeDate = () => {
    const newDate = dateInput.value;
    if (newDate) {
      currentDate = newDate;
      updateDateDisplay();
      renderTeamTable();
      renderParticipantTable();
      updateSummary();
    }
  };

  // Calculate attendance statistics
  function calculateStats(list, attendanceData, type) {
    const total = list.length;
    const present = list.filter((_, index) => attendanceData[type][index] === true).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, percentage };
  }

  // Update summary section
  function updateSummary() {
    const attendanceData = loadAttendanceData();
    
    const teamStats = calculateStats(teamList, attendanceData, 'team');
    const participantStats = calculateStats(participantList, attendanceData, 'participants');

    // Update team summary
    document.getElementById("teamTotalCount").textContent = teamStats.total;
    document.getElementById("teamPresentCount").textContent = teamStats.present;
    document.getElementById("teamPercentage").textContent = `${teamStats.percentage}%`;

    // Update participant summary
    document.getElementById("participantTotalCount").textContent = participantStats.total;
    document.getElementById("participantPresentCount").textContent = participantStats.present;
    document.getElementById("participantPercentage").textContent = `${participantStats.percentage}%`;

    // Update stats in table headers
    document.getElementById("teamStats").textContent = `Present: ${teamStats.present} / Total: ${teamStats.total}`;
    document.getElementById("participantStats").textContent = `Present: ${participantStats.present} / Total: ${participantStats.total}`;
  }

  // Render team member table
  function renderTeamTable() {
    teamTableBody.innerHTML = "";
    const attendanceData = loadAttendanceData();

    if (teamList.length === 0) {
      teamTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #666; padding: 20px;">
            No team members found for this event.
          </td>
        </tr>`;
      return;
    }

    teamList.forEach((member, index) => {
      const isPresent = attendanceData.team[index] === true;
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.role}</td>
        <td>
          <input type="checkbox" ${isPresent ? "checked" : ""} 
                 onchange="toggleTeamAttendance(${index})" 
                 ${currentUserRole !== "admin" ? "disabled" : ""}>
          <span class="${isPresent ? 'present' : 'absent'}">
            ${isPresent ? 'Present' : 'Absent'}
          </span>
        </td>
        <td>
          ${currentUserRole === "admin" ? `
            <button class="action-btn mark-present-btn" onclick="markTeamAttendance(${index}, true)" 
                    ${isPresent ? 'disabled' : ''}>Mark Present</button>
            <button class="action-btn mark-absent-btn" onclick="markTeamAttendance(${index}, false)" 
                    ${!isPresent ? 'disabled' : ''}>Mark Absent</button>
          ` : `<span>View Only</span>`}
        </td>
      `;
      teamTableBody.appendChild(row);
    });
  }

  // Render participant table
  function renderParticipantTable() {
    participantTableBody.innerHTML = "";
    const attendanceData = loadAttendanceData();

    if (participantList.length === 0) {
      participantTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #666; padding: 20px;">
            No participants found for this event.
          </td>
        </tr>`;
      return;
    }

    participantList.forEach((participant, index) => {
      const isPresent = attendanceData.participants[index] === true;
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${participant.name}</td>
        <td>${participant.email}</td>
        <td>${participant.phone}</td>
        <td>
          <input type="checkbox" ${isPresent ? "checked" : ""} 
                 onchange="toggleParticipantAttendance(${index})" 
                 ${currentUserRole !== "admin" ? "disabled" : ""}>
          <span class="${isPresent ? 'present' : 'absent'}">
            ${isPresent ? 'Present' : 'Absent'}
          </span>
        </td>
        <td>
          ${currentUserRole === "admin" ? `
            <button class="action-btn mark-present-btn" onclick="markParticipantAttendance(${index}, true)" 
                    ${isPresent ? 'disabled' : ''}>Mark Present</button>
            <button class="action-btn mark-absent-btn" onclick="markParticipantAttendance(${index}, false)" 
                    ${!isPresent ? 'disabled' : ''}>Mark Absent</button>
          ` : `<span>View Only</span>`}
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

  // Toggle team attendance via checkbox
  window.toggleTeamAttendance = (index) => {
    if (currentUserRole !== "admin") return;
    
    const attendanceData = loadAttendanceData();
    attendanceData.team[index] = !attendanceData.team[index];
    saveAttendanceData(attendanceData);
    renderTeamTable();
    updateSummary();
  };

  // Toggle participant attendance via checkbox
  window.toggleParticipantAttendance = (index) => {
    if (currentUserRole !== "admin") return;
    
    const attendanceData = loadAttendanceData();
    attendanceData.participants[index] = !attendanceData.participants[index];
    saveAttendanceData(attendanceData);
    renderParticipantTable();
    updateSummary();
  };

  // Mark team attendance via buttons
  window.markTeamAttendance = (index, isPresent) => {
    if (currentUserRole !== "admin") return;
    
    const attendanceData = loadAttendanceData();
    attendanceData.team[index] = isPresent;
    saveAttendanceData(attendanceData);
    renderTeamTable();
    updateSummary();
  };

  // Mark participant attendance via buttons
  window.markParticipantAttendance = (index, isPresent) => {
    if (currentUserRole !== "admin") return;
    
    const attendanceData = loadAttendanceData();
    attendanceData.participants[index] = isPresent;
    saveAttendanceData(attendanceData);
    renderParticipantTable();
    updateSummary();
  };

  // Go back to team and participants page
  window.goBack = () => {
    window.location.href = `team_participant.html?id=${eventId}`;
  };

  // Initialize the page
  renderTeamTable();
  renderParticipantTable();
  switchView("team"); // Start with team view
  updateSummary();

  console.log("Attendance page initialized for event:", eventId);
  console.log("Team members:", teamList.length);
  console.log("Participants:", participantList.length);
});