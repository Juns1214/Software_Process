let employees = [
  { id: "EMP001", name: "Alice Lim", email: "alice@example.com", phone: "0111234567", position: "Project Lead" },
  { id: "EMP002", name: "Brian Koh", email: "brian@example.com", phone: "0178899233", position: "Designer" },
  { id: "EMP003", name: "Chloe Tan", email: "chloe@example.com", phone: "0107788991", position: "Developer" },
  { id: "EMP004", name: "Daniel Lee", email: "daniel@example.com", phone: "0123456789", position: "Promoter" },
  { id: "EMP005", name: "Emma Wong", email: "emma@example.com", phone: "0134567890", position: "Event Crew" },
  { id: "EMP006", name: "Faisal Rahman", email: "faisal@example.com", phone: "0192233445", position: "Event Supervisor" },
  { id: "EMP007", name: "Grace Lim", email: "grace@example.com", phone: "0176677889", position: "Promoter" },
  { id: "EMP008", name: "Henry Tan", email: "henry@example.com", phone: "0145566778", position: "Photographer" },
  { id: "EMP009", name: "Ivy Ong", email: "ivy@example.com", phone: "0169988776", position: "Videographer" },
  { id: "EMP010", name: "Jacky Chan", email: "jacky@example.com", phone: "0183322110", position: "Logistics Assistant" },
  { id: "EMP011", name: "Karen Yap", email: "karen@example.com", phone: "0122299881", position: "Promoter" },
  { id: "EMP012", name: "Liam Chong", email: "liam@example.com", phone: "0116677882", position: "Event Technician" },
  { id: "EMP013", name: "Megan Lee", email: "megan@example.com", phone: "0173344556", position: "Assistant Crew" },
  { id: "EMP014", name: "Nathan Goh", email: "nathan@example.com", phone: "0131122334", position: "Event Supervisor" },
  { id: "EMP015", name: "Olivia Teo", email: "olivia@example.com", phone: "0183344556", position: "Promoter" },
  { id: "EMP016", name: "Peter Lim", email: "peter@example.com", phone: "0194433221", position: "Stagehand" },
  { id: "EMP017", name: "Queenie Yap", email: "queenie@example.com", phone: "0124433556", position: "Designer" },
  { id: "EMP018", name: "Ryan Chin", email: "ryan@example.com", phone: "0156677889", position: "Promoter" },
  { id: "EMP019", name: "Sophia Tan", email: "sophia@example.com", phone: "0143322110", position: "Front Desk Staff" },
  { id: "EMP020", name: "Terry Lau", email: "terry@example.com", phone: "0119988776", position: "Runner" },
  { id: "EMP021", name: "Umairah Ali", email: "umairah@example.com", phone: "0178899001", position: "Photographer" },
  { id: "EMP022", name: "Victor Lee", email: "victor@example.com", phone: "0192233445", position: "Event Crew" },
  { id: "EMP023", name: "Wendy Ng", email: "wendy@example.com", phone: "0124567890", position: "Assistant Crew" },
  { id: "EMP024", name: "Xavier Yong", email: "xavier@example.com", phone: "0147766554", position: "Promoter" },
  { id: "EMP025", name: "Yasmin Idris", email: "yasmin@example.com", phone: "0188877665", position: "Event Technician" },
  { id: "EMP026", name: "Zack Ho", email: "zack@example.com", phone: "0133355779", position: "Photographer" },
  { id: "EMP027", name: "Bella Chai", email: "bella@example.com", phone: "0168899775", position: "Videographer" },
  { id: "EMP028", name: "Dylan Foo", email: "dylan@example.com", phone: "0126677889", position: "Event Assistant" },
  { id: "EMP029", name: "Elaine Mok", email: "elainem@example.com", phone: "0193344556", position: "Promoter" },
  { id: "EMP030", name: "Farah Zain", email: "farah@example.com", phone: "0181122334", position: "Logistics Assistant" },
];


let admins = [
  { id: "ADM001", name: "Derek Ong", email: "derek@example.com", phone: "0123344556", position: "System Admin" },
  { id: "ADM002", name: "Elaine Goh", email: "elaine@example.com", phone: "0186677889", position: "Operations Head" },
  { id: "ADM003", name: "Aaron Lim", email: "aaron@example.com", phone: "0172233445", position: "IT Manager" },
  { id: "ADM004", name: "Brenda Chan", email: "brenda@example.com", phone: "0194455667", position: "Finance Manager" },
  { id: "ADM005", name: "Clement Ho", email: "clement@example.com", phone: "0129988776", position: "Event Director" },
  { id: "ADM006", name: "Diana Ng", email: "diana@example.com", phone: "0185544332", position: "Marketing Head" },
  { id: "ADM007", name: "Eugene Tan", email: "eugene@example.com", phone: "0116655443", position: "HR Manager" },
  { id: "ADM008", name: "Fiona Lee", email: "fiona@example.com", phone: "0147788990", position: "Project Director" },
  { id: "ADM009", name: "Gavin Yong", email: "gavin@example.com", phone: "0134455667", position: "Security Lead" },
  { id: "ADM010", name: "Hazel Wong", email: "hazel@example.com", phone: "0156677881", position: "Quality Manager" },
  { id: "ADM011", name: "Isaac Tan", email: "isaac@example.com", phone: "0125544332", position: "System Admin" },
  { id: "ADM012", name: "Joanne Loh", email: "joanne@example.com", phone: "0184433221", position: "Operations Manager" },
  { id: "ADM013", name: "Kelvin Goh", email: "kelvin@example.com", phone: "0191122334", position: "Event Strategist" },
  { id: "ADM014", name: "Linda Yap", email: "linda@example.com", phone: "0137788990", position: "Senior Manager" },
  { id: "ADM015", name: "Marcus Teh", email: "marcus@example.com", phone: "0169988776", position: "Venue Coordinator" },
];


let currentType = "employee";

function showTeam(type) {
  const teamBody = document.getElementById("teamBody");
  const title = document.getElementById("memberTypeTitle");
  const list = type === "employee" ? employees : admins;

  currentType = type;
  title.textContent = type === "employee" ? "Employee" : "Admin";

  teamBody.innerHTML = "";
  list.forEach((member, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.position}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editRow(${index})">Edit</button>
        <button class="action-btn delete-btn" onclick="confirmDelete(${index})">Delete</button>
      </td>
    `;
    teamBody.appendChild(row);
  });
}

function openAddModal() {
  document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  clearForm();
}

function clearForm() {
  document.getElementById("newId").value = '';
  document.getElementById("newName").value = '';
  document.getElementById("newEmail").value = '';
  document.getElementById("newPhone").value = '';
  document.getElementById("newPosition").value = '';
}

function addMember() {
  const id = document.getElementById("newId").value;
  const name = document.getElementById("newName").value;
  const email = document.getElementById("newEmail").value;
  const phone = document.getElementById("newPhone").value;
  const position = document.getElementById("newPosition").value;

  if (!id || !name || !email || !phone || !position) return alert("Please fill in all fields.");

  const newMember = { id, name, email, phone, position };

  if (currentType === "employee") {
    employees.push(newMember);
  } else {
    admins.push(newMember);
  }

  closeAddModal();
  showTeam(currentType);
}

function confirmDelete(index) {
  if (confirm("Are you sure you want to delete this member?")) {
    if (currentType === "employee") {
      employees.splice(index, 1);
    } else {
      admins.splice(index, 1);
    }
    showTeam(currentType);
  }
}

function editRow(index) {
  const list = currentType === "employee" ? employees : admins;
  const row = document.getElementById("teamBody").children[index];
  const member = list[index];

  row.innerHTML = `
    <td>${member.id}</td>
    <td><input type="text" value="${member.name}" /></td>
    <td><input type="email" value="${member.email}" /></td>
    <td><input type="text" value="${member.phone}" /></td>
    <td><input type="text" value="${member.position}" /></td>
    <td>
      <button class="action-btn edit-btn" onclick="saveRow(${index})">Save</button>
      <button class="action-btn delete-btn" onclick="confirmDelete(${index})">Delete</button>
    </td>
  `;
}

function saveRow(index) {
  const list = currentType === "employee" ? employees : admins;
  const row = document.getElementById("teamBody").children[index];
  const inputs = row.querySelectorAll("input");

  const updatedMember = {
    id: list[index].id,
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    position: inputs[3].value
  };

  list[index] = updatedMember;
  showTeam(currentType);
}


// Initial render
window.onload = () => showTeam("employee");
