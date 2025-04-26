document.addEventListener("DOMContentLoaded", () => {
    const leagueName = new URLSearchParams(window.location.search).get("league");
    document.getElementById("league-name").textContent = leagueName;
  
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    fetch("users.json")
      .then((res) => res.json())
      .then((users) => {
        const leagueUsers = users.filter((u) => u.leagues.includes(leagueName) || u.leagues.includes("ALL"));
  
        const container = document.getElementById("user-container");
  
        leagueUsers.slice(0, 5).forEach((user) => {
          const card = document.createElement("div");
          card.className = "user-card";
          card.innerHTML = `
            <h3>${user.username}</h3>
            <p>Fantasy Team</p>
          `;
          container.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Error loading users.json", err);
      });
  });
  