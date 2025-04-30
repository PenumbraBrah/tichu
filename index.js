document
  .getElementById("dark-mode-toggle")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });

let roundNumber = 1;
let tigerTotal = 0;
let serpentTotal = 0;
const historyBody = document.getElementById("history-body");

const tigerInputScore = document.getElementById("tiger-input-score");
const serpentInputScore = document.getElementById("serpent-input-score");

const threeWayToggles = document.querySelectorAll("button.three-way-toggle");
const twoWayToggles = document.querySelectorAll("button.two-way-toggle");

function toggleState(button) {
  if (button.classList.contains("active-won")) {
    button.classList.remove("active-won");
    button.classList.add("active-lost");
  } else if (button.classList.contains("active-lost")) {
    button.classList.remove("active-lost");
  } else {
    button.classList.add("active-won");
  }
}

function toggleSelected(button) {
  if (button.classList.contains("active")) {
    button.classList.remove("active");
  } else {
    button.classList.add("active");
  }
}

threeWayToggles.forEach((button) => {
  button.addEventListener("click", () => toggleState(button));
});

twoWayToggles.forEach((button) => {
  button.addEventListener("click", () => toggleSelected(button));
});

document.body.classList.toggle("dark-mode");

function addPoints(tig) {
  let result = 0;
  const tigerRunning = parseInt(tigerInputScore.textContent) + tig;
  if (tigerRunning < -25) {
    result = -25;
  } else if (tigerRunning > 125) {
    result = 125;
  } else {
    result = tigerRunning;
  }
  tigerInputScore.textContent = result;
  serpentInputScore.textContent = 100 - result;
}

function updateScores() {
  // Update the total score displays
  document.getElementById("tiger-score").textContent = tigerTotal;
  document.getElementById("serpent-score").textContent = serpentTotal;
  tigerInputScore.textContent = 50;
  serpentInputScore.textContent = 50;
}

document.getElementById("submit-round").addEventListener("click", () => {
  const tigerPoints = parseInt(tigerInputScore.textContent);
  const serpentPoints = parseInt(serpentInputScore.textContent);

  let tigerScore = tigerPoints;
  let serpentScore = serpentPoints;
  let details = [];

  if (document.getElementById("tiger-sweep").classList.contains("active")) {
    tigerScore = 200;
    serpentScore = 0;
    details.push("🐅 Sweep");
  }
  if (document.getElementById("serpent-sweep").classList.contains("active")) {
    tigerScore = 0;
    serpentScore = 200;
    details.push("🐍 Sweep");
  }
  if (document.getElementById("tiger-tichu").classList.contains("active-won")) {
    tigerScore += 100;
    details.push("🐅 Tichu - Won");
  } else if (
    document.getElementById("tiger-tichu").classList.contains("active-lost")
  ) {
    tigerScore -= 100;
    details.push("🐅 Tichu - Lost");
  }

  if (
    document.getElementById("serpent-tichu").classList.contains("active-won")
  ) {
    serpentScore += 100;
    details.push("🐍 Tichu - Won");
  } else if (
    document.getElementById("serpent-tichu").classList.contains("active-lost")
  ) {
    serpentScore -= 100;
    details.push("🐍 Tichu - Lost");
  }

  if (
    document.getElementById("serpent-grand").classList.contains("active-won")
  ) {
    serpentScore += 200;
    details.push("🐍 Grand Tichu - Won");
  } else if (
    document.getElementById("serpent-grand").classList.contains("active-lost")
  ) {
    serpentScore -= 200;
    details.push("🐍 Grand Tichu - Lost");
  }

  historyBody.innerHTML += `
                <tr>
                    <td>${roundNumber}</td>
                    <td>${tigerScore}</td>
                    <td>${serpentScore}</td>
                    <td>${details.join("; ")}</td>
                </tr>
            `;

  tigerTotal += tigerScore;
  serpentTotal += serpentScore;
  saveHistory();
  updateScores();
  roundNumber++;

  document.querySelectorAll("button").forEach((button) => {
    button.classList.remove("active-won", "active-lost", "active");
  });
});

document.getElementById("reset-game").addEventListener("click", () => {
  roundNumber = 1;
  tigerTotal = serpentTotal = 0;
  historyBody.innerHTML = "";
  document.querySelectorAll("button").forEach((button) => {
    button.classList.remove("active-won", "active-lost", "active");
  });
  tigerInputScore.textContent = 50;
  serpentInputScore.textContent = 50;
  updateScores();
  saveHistory();
});

function saveHistory() {
  const gameData = {
    history: historyBody.innerHTML,
    tigerTotal: tigerTotal,
    serpentTotal: serpentTotal
  };

  document.cookie = `tichuHistory=${encodeURIComponent(
    JSON.stringify(gameData)
  )}; path=/`;
}

function loadHistory() {
  const cookies = document.cookie.split("; ");
  const historyCookie = cookies.find((row) => row.startsWith("tichuHistory="));
  if (historyCookie) {
    const gameData = JSON.parse(
      decodeURIComponent(historyCookie.split("=")[1])
    );
    historyBody.innerHTML = gameData.history;
    tigerTotal = gameData.tigerTotal;
    serpentTotal = gameData.serpentTotal;
    roundNumber = historyBody.rows.length + 1;

    updateScores();
  }
}

loadHistory();

