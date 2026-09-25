const defaultGames = [
  {
    id: "neon-drift",
    name: "Neon Drift",
    tag: "Arcade",
    icon: "🏎️",
    accent: "linear-gradient(135deg, #7c8cff, #9bc7ff)",
    summary: "A fast-paced racing game with stylized neon visuals and boost-based combat.",
    language: "JavaScript",
    code: `const track = document.querySelector('#track');

function updateCarPosition(x, y) {
  car.style.transform = \`translate(${x}px, ${y}px)\`;
}

setInterval(() => {
  const boost = Math.random() > 0.5 ? 18 : 8;
  player.speed += boost;
  renderTrack();
}, 120);`,
    plays: 3482
  },
  {
    id: "pixel-pirates",
    name: "Pixel Pirates",
    tag: "Adventure",
    icon: "🧭",
    accent: "linear-gradient(135deg, #56e0c2, #7ef0d3)",
    summary: "Sail through treasure islands, unlock dungeons, and outsmart rival captains.",
    language: "TypeScript",
    code: `type Player = {
  hp: number;
  gold: number;
};

const player: Player = { hp: 100, gold: 30 };

function collectTreasure(amount: number) {
  player.gold += amount;
  console.log('Treasure collected:', amount);
}`,
    plays: 2891
  },
  {
    id: "sky-bloom",
    name: "Sky Bloom",
    tag: "Puzzle",
    icon: "🌼",
    accent: "linear-gradient(135deg, #ff63c3, #ff8bc3)",
    summary: "Arrange floating flora in layered pathways and awaken magical skies.",
    language: "Python",
    code: `def solve_board(board):
    for row in range(len(board)):
        for col in range(len(board[row])):
            if board[row][col] == 0:
                board[row][col] = 1
    return board`,
    plays: 1954
  },
  {
    id: "shadow-craft",
    name: "Shadow Craft",
    tag: "RPG",
    icon: "🗡️",
    accent: "linear-gradient(135deg, #ffb454, #ffd89c)",
    summary: "Build an arsenal, gather relics, and survive enemy waves in a shadow realm.",
    language: "C#",
    code: `public class Guardian {
  public int Health { get; set; }

  public void Attack() {
    Console.WriteLine("Guardian strikes with force!");
  }
}`,
    plays: 1623
  },
  {
    id: "orbit-quest",
    name: "Orbit Quest",
    tag: "Strategy",
    icon: "🪐",
    accent: "linear-gradient(135deg, #8d80ff, #b39bff)",
    summary: "Command a starship fleet in deep space and optimize routes through danger zones.",
    language: "Rust",
    code: `fn compute_route(stars: Vec<i32>) -> i32 {
    let total: i32 = stars.iter().sum();
    total / 2
}`,
    plays: 892
  },
  {
    id: "forest-run",
    name: "Forest Run",
    tag: "Runner",
    icon: "🌲",
    accent: "linear-gradient(135deg, #4ac5a5, #86e2b7)",
    summary: "Dash through enchanted forest trails while collecting glowing relics.",
    language: "CSS",
    code: `.runner {
  animation: sprint 1.2s ease-in-out infinite alternate;
}

@keyframes sprint {
  from { transform: translateX(0); }
  to { transform: translateX(18px); }
}`,
    plays: 745
  }
];

let games = [...defaultGames];

const bubblesContainer = document.getElementById("game-bubbles");
const previewCard = document.getElementById("preview-card");
const codeBlock = document.getElementById("code-block");
const codeLanguage = document.getElementById("code-language");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");
const modal = document.getElementById("signup-modal");
const closeModalBtn = document.getElementById("close-modal");
const submitGameBtns = document.querySelectorAll("#submit-game-btn, #submit-game-btn-cta");
const gameForm = document.getElementById("game-form");
const gameCountDisplay = document.getElementById("game-count");

// Load games from localStorage
function loadGamesFromStorage() {
  const stored = localStorage.getItem("userGames");
  if (stored) {
    const userGames = JSON.parse(stored);
    games = [...defaultGames, ...userGames];
  }
}

// Save games to localStorage
function saveGamesToStorage() {
  const userGames = games.slice(defaultGames.length);
  localStorage.setItem("userGames", JSON.stringify(userGames));
}

// Sort games by play count (most popular first)
function sortGamesByPopularity() {
  games.sort((a, b) => (b.plays || 0) - (a.plays || 0));
}

function renderBubbles() {
  sortGamesByPopularity();
  bubblesContainer.innerHTML = games
    .map(
      (game, index) => `
        <button
          class="game-bubble ${index === 0 ? "active" : ""}"
          type="button"
          data-game-id="${game.id}"
          aria-label="Open ${game.name}"
        >
          <div class="icon" style="background:${game.accent};">${game.icon}</div>
          <strong>${game.name}</strong>
          <span>${game.tag}</span>
          <div class="plays">👁️ ${game.plays || 0} plays</div>
        </button>
      `
    )
    .join("");

  gameCountDisplay.textContent = games.length;

  const buttons = document.querySelectorAll(".game-bubble");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedGame = games.find((game) => game.id === button.dataset.gameId);
      if (!selectedGame) return;

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      updateGameDetails(selectedGame);
    });
  });
}

function updateGameDetails(game) {
  codeBlock.textContent = game.code;
  codeLanguage.textContent = game.language;

  previewCard.innerHTML = `
    <div class="preview-screen">
      <div class="mini-characters">
        <span class="character one" style="background:${game.accent};"></span>
        <span class="character two" style="background:${game.accent};"></span>
        <span class="character three" style="background:${game.accent};"></span>
      </div>
    </div>
  `;

  const screen = previewCard.querySelector(".preview-screen");
  screen.style.boxShadow = `inset 0 0 80px ${game.accent.replace("linear-gradient", "rgba")}`;
}

function addMessage(text, sender = "You", isOutgoing = true) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${isOutgoing ? "outgoing" : "incoming"}`;

  if (!isOutgoing) {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender.charAt(0).toUpperCase();
    wrapper.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = sender;
  bubble.appendChild(name);

  const p = document.createElement("p");
  p.textContent = text;
  bubble.appendChild(p);
  wrapper.appendChild(bubble);

  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Modal functions
function openModal() {
  modal.removeAttribute("hidden");
  gameForm.reset();
}

function closeModal() {
  modal.setAttribute("hidden", "");
}

submitGameBtns.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target === modal.querySelector(".modal-overlay")) {
    closeModal();
  }
});

// Game form submission
gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const gameName = document.getElementById("game-name").value.trim();
  const gameTag = document.getElementById("game-tag").value.trim();
  const gameIcon = document.getElementById("game-icon").value.trim();
  const gameSummary = document.getElementById("game-summary").value.trim();
  const gameCode = document.getElementById("game-code").value.trim();
  const gameLanguage = document.getElementById("game-language").value.trim();

  if (!gameName || !gameTag || !gameIcon || !gameSummary || !gameCode || !gameLanguage) {
    alert("Please fill out all fields!");
    return;
  }

  // Generate a random accent color
  const accents = [
    "linear-gradient(135deg, #7c8cff, #9bc7ff)",
    "linear-gradient(135deg, #56e0c2, #7ef0d3)",
    "linear-gradient(135deg, #ff63c3, #ff8bc3)",
    "linear-gradient(135deg, #ffb454, #ffd89c)",
    "linear-gradient(135deg, #8d80ff, #b39bff)",
    "linear-gradient(135deg, #4ac5a5, #86e2b7)"
  ];
  const randomAccent = accents[Math.floor(Math.random() * accents.length)];

  const newGame = {
    id: `game-${Date.now()}`,
    name: gameName,
    tag: gameTag,
    icon: gameIcon,
    accent: randomAccent,
    summary: gameSummary,
    language: gameLanguage,
    code: gameCode,
    plays: Math.floor(Math.random() * 500) + 50 // Start with some plays
  };

  games.push(newGame);
  saveGamesToStorage();
  renderBubbles();
  updateGameDetails(games[0]);
  closeModal();

  // Show a success message
  addMessage(`${gameName} has been posted! Check it out in the games section.`, "System", false);
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = chatInput.value.trim();
  if (!value) return;

  addMessage(value, "You", true);
  chatInput.value = "";

  setTimeout(() => {
    const autoResponses = [
      "That sounds awesome — I'll keep building on it.",
      "I love that idea. Let's make it part of the next build.",
      "Nice! I'm adding that feature into the roadmap.",
      "This would be a great addition to the next release."
    ];
    const response = autoResponses[Math.floor(Math.random() * autoResponses.length)];
    addMessage(response, "Avery", false);
  }, 700);
});

// Initialize
loadGamesFromStorage();
renderBubbles();
updateGameDetails(games[0]);
