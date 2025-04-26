// Utility: Load users from localStorage
function getStoredUsers() {
    return JSON.parse(localStorage.getItem("allUsers")) || [];
  }
  
  // Utility: Save users to localStorage
  function setStoredUsers(users) {
    localStorage.setItem("allUsers", JSON.stringify(users));
  }
  
  // Utility: Load leagues from localStorage
  function getStoredLeagues() {
    return JSON.parse(localStorage.getItem("allLeagues")) || [];
  }
  
  // Utility: Save leagues to localStorage
  function setStoredLeagues(leagues) {
    localStorage.setItem("allLeagues", JSON.stringify(leagues));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const leagueForm = document.getElementById("create-league-form");
    const leagueList = document.getElementById("league-list");
    const userList = document.getElementById("user-list");
  
    renderLeagues();
    renderUsers();
  
    // Create a new league
    leagueForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newLeague = document.getElementById("new-league-name").value.trim();
      if (!newLeague) return alert("League name can't be empty.");
  
      const leagues = getStoredLeagues();
      if (leagues.includes(newLeague)) {
        return alert("League already exists.");
      }
  
      leagues.push(newLeague);
      setStoredLeagues(leagues);
      document.getElementById("new-league-name").value = "";
      renderLeagues();
    });
  
    // Renders the leagues as a list
    function renderLeagues() {
      const leagues = getStoredLeagues();
      leagueList.innerHTML = leagues.map(l => `<li>${l}</li>`).join("");
    }
  
    // Renders all users and lets admin manage their league access
    function renderUsers() {
      const users = getStoredUsers();
      const leagues = getStoredLeagues();
      userList.innerHTML = "";
  
      users.forEach((user, idx) => {
        if (user.username === "Admin") return;
  
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");
  
        const title = document.createElement("h4");
        title.textContent = user.username;
  
        const leagueCheckboxes = leagues.map(league => {
          const isChecked = user.leagues.includes(league);
          return `
            <label>
              <input type="checkbox" data-user-index="${idx}" data-league="${league}" ${isChecked ? "checked" : ""}>
              ${league}
            </label>`;
        }).join("<br>");
  
        userCard.innerHTML = `
          ${title.outerHTML}
          ${leagueCheckboxes}
        `;
  
        userList.appendChild(userCard);
      });
  
      // Listen for checkbox changes
      userList.addEventListener("change", (e) => {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
          const idx = parseInt(e.target.dataset.userIndex);
          const league = e.target.dataset.league;
          const users = getStoredUsers();
  
          if (!users[idx]) return;
  
          if (e.target.checked) {
            if (!users[idx].leagues.includes(league)) {
              users[idx].leagues.push(league);
            }
          } else {
            users[idx].leagues = users[idx].leagues.filter(l => l !== league);
          }
  
          setStoredUsers(users);
        }
      });
    }
  });
  