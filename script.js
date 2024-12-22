// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyCAGuYY12pfsbeebuY5ot9JcgXCnRRQSLs",
    authDomain: "brawlhalla-database-project.firebaseapp.com",
    databaseURL: "https://brawlhalla-database-project-default-rtdb.firebaseio.com",
    projectId: "brawlhalla-database-project",
    storageBucket: "brawlhalla-database-project.firebasestorage.app",
    messagingSenderId: "240647397387",
    appId: "1:240647397387:web:5871d6f5819339ba37270e",
    measurementId: "G-XG2525LXEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const searchButton = document.getElementById("searchButton");
const playerIdInput = document.getElementById("playerId");
const playerDataDiv = document.getElementById("playerData");
const playerNameSpan = document.getElementById("playerName");
const playerRatingSpan = document.getElementById("playerRating");
const playerTimestampSpan = document.getElementById("playerTimestamp");

// Fetch player data from Firebase
async function fetchPlayerData(playerId) {
  const playerRef = ref(db, "players/" + playerId);
  try {
    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Display player data
      playerNameSpan.textContent = data.name;
      playerRatingSpan.textContent = data.rating;
      playerTimestampSpan.textContent = new Date(data.timestamp).toLocaleString();
      playerDataDiv.classList.remove("hidden");
    } else {
      alert("No data found for this player ID!");
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
    alert("An error occurred while fetching player data.");
  }
}

// Event Listener for Search Button
searchButton.addEventListener("click", () => {
  const playerId = playerIdInput.value.trim();
  if (playerId) {
    fetchPlayerData(playerId);
  } else {
    alert("Please enter a Player ID!");
  }
});