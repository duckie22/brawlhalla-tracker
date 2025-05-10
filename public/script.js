// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const database = getDatabase(app);

// Dynamic user IDs list
let userIDs = [];

// Fetch the user IDs from the database
function fetchUserIDs() {
    const userIDsRef = ref(database, "players");
    get(userIDsRef).then((snapshot) => {
        if (snapshot.exists()) {
            userIDs = Object.keys(snapshot.val());
            console.log("Fetched user IDs:", userIDs);
        } else {
            console.log("No players found in the database.");
        }
    }).catch((error) => {
        console.error("Error fetching user IDs:", error);
    });
}

// Call the function to populate userIDs when the page loads
fetchUserIDs();

// Get references to HTML elements
const playerNameInput = document.getElementById("playerNameInput");
const searchButton = document.getElementById("searchButton");
const brawlhallaIDInput = document.getElementById("brawlhallaIDInput");
const addButton = document.getElementById("addButton");
const idFeedback = document.getElementById("idFeedback");
const chartContainer = document.getElementById("chartContainer");
const playerChartCanvas = document.getElementById("playerChart");

let playerChart;

// Function to draw the player's graph
function drawPlayerGraph(playerData) {
    const labels = playerData.timestamp.map((ts) => new Date(ts).toLocaleString());
    const data = playerData.rating;

    if (playerChart) {
        playerChart.destroy();
    }

    playerChart = new Chart(playerChartCanvas.getContext("2d"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Rating Over Time",
                    data: data,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    });
}

// Function to search for a player by name
function searchPlayer() {
    const playerName = playerNameInput.value.trim();

    if (!playerName) {
        alert("Please enter a player name!");
        return;
    }

    const playerRef = ref(database, `players/${playerName}`);
    get(playerRef).then((snapshot) => {
        if (snapshot.exists()) {
            const playerData = snapshot.val();
            drawPlayerGraph(playerData);
            chartContainer.classList.remove("hidden");
        } else {
            alert(`Player "${playerName}" not found in the database.`);
            chartContainer.classList.add("hidden");
        }
    }).catch((error) => {
        console.error("Error searching for player:", error);
    });
}

// Function to validate and add a new Brawlhalla ID
async function addBrawlhallaID() {
    const brawlhallaID = brawlhallaIDInput.value.trim();

    if (!brawlhallaID || isNaN(brawlhallaID)) {
        idFeedback.textContent = "Please enter a valid Brawlhalla ID.";
        return;
    }

    if (userIDs.includes(brawlhallaID)) {
        idFeedback.textContent = "This Brawlhalla ID already exists.";
        console.log("This Brawlhalla ID already exists.");
        return;
    }

    const API_URL = `https://api.brawlhalla.com/player/${brawlhallaID}/ranked?api_key=SVT4VGIRAY8UUQ2ZESIV`;
    try {
       
        const response = await fetch(API_URL);

        console.log(response);

        if (!response.ok) {
            console.log("Invalid Brawlhalla ID.");
            throw new Error("Invalid Brawlhalla ID.");

        }

        const newPlayerRef = ref(database, `players/${brawlhallaID}`);
        await set(newPlayerRef, {
            name: `Player_${brawlhallaID}`, // Placeholder name (can be updated with the API response)
            rating: [],
            games: [],
            timestamp: [],
        });

        fetchUserIDs(); // Refresh the user IDs
        idFeedback.style.color = "green";
        idFeedback.textContent = "Brawlhalla ID successfully added!";
    } catch (error) {
        idFeedback.style.color = "red";
        idFeedback.textContent = "Failed to validate Brawlhalla ID.";
    }
}

// Attach event listeners
searchButton.addEventListener("click", searchPlayer);
addButton.addEventListener("click", addBrawlhallaID);