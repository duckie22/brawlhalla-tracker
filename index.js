const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

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
const database = getDatabase(app);

const { ref, set } = require("firebase/database");

function writePlayerData(playerId, name, rating) {
    const db = getDatabase();
    set(ref(db, 'players/' + playerId), {
        name: name,
        rating: rating,
        timestamp: new Date().toISOString(),
    })
        .then(() => console.log("Data saved successfully!"))
        .catch((error) => console.error("Error saving data:", error));
}

// Example: Add a player's data
writePlayerData("123456", "Player1", 2000);

const { get } = require("firebase/database");

function getPlayerData(playerId) {
    const db = getDatabase();
    const playerRef = ref(db, 'players/' + playerId);

    get(playerRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Player Data:", snapshot.val());
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Example: Fetch a player's data
getPlayerData("123456");