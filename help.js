document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole") || "employee";

  if (role === "employee") {
    const linksToHide = [
      document.getElementById("pastEventLink"),
      document.getElementById("teamLink")
    ];

    linksToHide.forEach(link => {
      if (link) link.style.display = "none";
    });
  }
});
