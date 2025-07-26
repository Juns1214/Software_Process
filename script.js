// Simulated database of employees
const employees = [
  { email: "admin@mindhive.com", password: "admin123", role: "admin" },
  { email: "jane@mindhive.com", password: "jane123", role: "employee" },
  { email: "john@mindhive.com", password: "john123", role: "employee" },
];

// Login function
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("error");

  const user = employees.find(
    (emp) => emp.email === email && emp.password === password
  );

  if (user) {
    // Save role to localStorage
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);

    // Redirect based on role
    if (user.role === "admin") {
      window.location.href = "admin_Dashboard.html"; // (create later)
    } else {
      window.location.href = "employee_Dashboard.html"; // (create later)
    }
  } else {
    errorEl.textContent = "Invalid email or password";
  }
}
