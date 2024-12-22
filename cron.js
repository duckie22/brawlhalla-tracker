// JavaScript source code
const cron = require("node-cron");
const { getDatabase, ref, set } = require("firebase/database");
const { initializeApp } = require("firebase/app");

// Firebase config
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

// Function to update player data
function updatePlayerData(playerId) {
    // Simulate API fetch and update Firebase (replace with real API call)
    const playerData = {
        name: "Player1",
        rating: Math.floor(Math.random() * 1000) + 1500, // Example: random rating
        timestamp: new Date().toISOString(),
    };

    set(ref(db, 'players/' + playerId), playerData)
        .then(() => console.log("Player data updated:", playerData))
        .catch((error) => console.error("Error updating data:", error));
}

// Schedule updates every hour
cron.schedule("* * * * *", () => {
    console.log("Running update every minute...");
    updatePlayerData("123457"); // Replace "123456" with your test player ID
});