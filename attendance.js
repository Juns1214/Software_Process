document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  const currentUserRole = localStorage.getItem("userRole") || "admin"; // ✅ FIXED KEY

  const teamTableBody = document.getElementById("teamMemberBody");
  const participantTableBody = document.getElementById("participantBody");
  const teamTable = document.getElementById("teamMemberTable");
  const participantTable = document.getElementById("participantTable");
  const dateInput = document.getElementById("attendanceDate");
  const selectedDateDisplay = document.getElementById("selectedDateDisplay");
  const summaryDate = document.getElementById("summaryDate");

  let currentMode = "team";
  let currentDate = new Date().toISOString().split('T')[0];

  if (!eventId) {
    alert("Invalid Event ID");
    return;
  }

  const teamList = JSON.parse(localStorage.getItem(`teamMembers_${eventId}`)) || [];
  const participantList = JSON.parse(localStorage.getItem(`participants_${eventId}`)) || [];

  if (teamList.length === 0 && participantList.length === 0) {
    alert("No team members or participants found. Please add them first.");
    goBack();
    return;
  }

  dateInput.value = currentDate;
  updateDateDisplay();

  function loadAttendanceData() {
    const attendanceKey = `attendance_${eventId}_${currentDate}`;
    return JSON.parse(localStorage.getItem(attendanceKey)) || { team: {}, participants: {} };
  }

  function saveAttendanceData(attendanceData) {
    const attendanceKey = `attendance_${eventId}_${currentDate}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData));
    console.log(`Attendance saved for ${currentDate}:`, attendanceData);
  }

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

  function calculateStats(list, attendanceData, type) {
    const total = list.length;
    const present = list.filter((_, index) => attendanceData[type][index] === true).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, percentage };
  }

  function updateSummary() {
    const attendanceData = loadAttendanceData();

    const teamStats = calculateStats(teamList, attendanceData, 'team');
    const participantStats = calculateStats(participantList, attendanceData, 'participants');

    document.getElementById("teamTotalCount").textContent = teamStats.total;
    document.getElementById("teamPresentCount").textContent = teamStats.present;
    document.getElementById("teamPercentage").textContent = `${teamStats.percentage}%`;

    document.getElementById("participantTotalCount").textContent = participantStats.total;
    document.getElementById("participantPresentCount").textContent = participantStats.present;
    document.getElementById("participantPercentage").textContent = `${participantStats.percentage}%`;

    document.getElementById("teamStats").textContent = `Present: ${teamStats.present} / Total: ${teamStats.total}`;
    document.getElementById("participantStats").textContent = `Present: ${participantStats.present} / Total: ${participantStats.total}`;
  }

  function renderTeamTable() {
    teamTableBody.innerHTML = "";
    const attendanceData = loadAttendanceData();

    if (teamList.length === 0) {
      teamTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #666; padding: 20px;">No team members found for this event.</td></tr>`;
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
          ${currentUserRole === "admin" ? `
            <input type="checkbox" ${isPresent ? "checked" : ""} onchange="toggleTeamAttendance(${index})">
          ` : `
            <span class="${isPresent ? 'present' : 'absent'}">${isPresent ? 'Present' : 'Absent'}</span>
          `}
        </td>
        <td>
          ${currentUserRole === "admin" ? `
            <button class="action-btn mark-present-btn" onclick="markTeamAttendance(${index}, true)" ${isPresent ? 'disabled' : ''}>Mark Present</button>
            <button class="action-btn mark-absent-btn" onclick="markTeamAttendance(${index}, false)" ${!isPresent ? 'disabled' : ''}>Mark Absent</button>
          ` : `<span>View Only</span>`}
        </td>
      `;
      teamTableBody.appendChild(row);
    });
  }

  function renderParticipantTable() {
    participantTableBody.innerHTML = "";
    const attendanceData = loadAttendanceData();

    if (participantList.length === 0) {
      participantTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #666; padding: 20px;">No participants found for this event.</td></tr>`;
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
          ${currentUserRole === "admin" ? `
            <input type="checkbox" ${isPresent ? "checked" : ""} onchange="toggleParticipantAttendance(${index})">
          ` : `
            <span class="${isPresent ? 'present' : 'absent'}">${isPresent ? 'Present' : 'Absent'}</span>
          `}
        </td>
        <td>
          ${currentUserRole === "admin" ? `
            <button class="action-btn mark-present-btn" onclick="markParticipantAttendance(${index}, true)" ${isPresent ? 'disabled' : ''}>Mark Present</button>
            <button class="action-btn mark-absent-btn" onclick="markParticipantAttendance(${index}, false)" ${!isPresent ? 'disabled' : ''}>Mark Absent</button>
          ` : `<span>View Only</span>`}
        </td>
      `;
      participantTableBody.appendChild(row);
    });
  }

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

  // Admin-only functions
  window.toggleTeamAttendance = (index) => {
    if (currentUserRole !== "admin") return;
    const attendanceData = loadAttendanceData();
    attendanceData.team[index] = !attendanceData.team[index];
    saveAttendanceData(attendanceData);
    renderTeamTable();
    updateSummary();
  };

  window.toggleParticipantAttendance = (index) => {
    if (currentUserRole !== "admin") return;
    const attendanceData = loadAttendanceData();
    attendanceData.participants[index] = !attendanceData.participants[index];
    saveAttendanceData(attendanceData);
    renderParticipantTable();
    updateSummary();
  };

  window.markTeamAttendance = (index, isPresent) => {
    if (currentUserRole !== "admin") return;
    const attendanceData = loadAttendanceData();
    attendanceData.team[index] = isPresent;
    saveAttendanceData(attendanceData);
    renderTeamTable();
    updateSummary();
  };

  window.markParticipantAttendance = (index, isPresent) => {
    if (currentUserRole !== "admin") return;
    const attendanceData = loadAttendanceData();
    attendanceData.participants[index] = isPresent;
    saveAttendanceData(attendanceData);
    renderParticipantTable();
    updateSummary();
  };

  window.goBack = () => {
    window.location.href = `team_participant.html?id=${eventId}`;
  };

  // Initialize
  renderTeamTable();
  renderParticipantTable();
  switchView("team");
  updateSummary();

  console.log("Attendance page initialized for event:", eventId);
});
