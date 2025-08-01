const employees = [
  { email: "admin@mindhive.com", password: "admin123", role: "admin", name: "Admin User" },
  { email: "jane@mindhive.com", password: "jane123", role: "employee", name: "Jane Smith" },
  { email: "john@mindhive.com", password: "john123", role: "employee", name: "John Doe" },
  // Add more employees with their names
];

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("error");

  const user = employees.find(
    (emp) => emp.email === email && emp.password === password
  );

  if (user) {
    // Store user data with consistent naming
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("role", user.role); // For backward compatibility
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);
    window.location.href = "main_Dashboard.html";
  } else {
    errorEl.textContent = "Invalid email or password";
  }
}