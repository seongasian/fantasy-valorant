// Fetch the users from users.json
async function fetchUsers() {
    const response = await fetch("users.json");
    const users = await response.json();
    return users;
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("login-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
  
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  
    // If on dashboard and not logged in, redirect
    if (window.location.pathname.includes("dashboard.html") && !currentUser) {
      window.location.href = "main.html";
      return;
    }
  
    // Show admin button if logged in as Admin
    if (currentUser && currentUser.username === "Admin") {
      const adminButton = document.createElement("button");
      adminButton.textContent = "Go to Admin Page";
      adminButton.classList.add("admin-button");
      adminButton.addEventListener("click", () => {
        window.location.href = "admin.html";
      });
      document.body.appendChild(adminButton);
    }
  
    // Handle login if login button exists (on main.html)
    if (loginBtn && usernameInput && passwordInput) {
      loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();
  
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
  
        const users = await fetchUsers();
        const user = users.find(u => u.username === username);
  
        if (!user) {
          alert("Username not found.");
          return;
        }
  
        if (user.password !== password) {
          alert("Incorrect password.");
          return;
        }
  
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      });
    }
  
    // Access control for leagues (only on dashboard)
    const leagueCards = document.querySelectorAll(".league-card");
    if (leagueCards && currentUser) {
      leagueCards.forEach(card => {
        const leagueName = card.getAttribute("data-league");
  
        const isAdmin = currentUser.username === "Admin" || currentUser.leagues.includes("ALL");
        const hasAccess = currentUser.leagues.includes(leagueName);
  
        if (!isAdmin && !hasAccess) {
          card.classList.add("disabled");
          card.style.pointerEvents = "none";
          card.style.opacity = "0.4";
          card.style.cursor = "not-allowed";
        }
      });
    }
  });
  
  