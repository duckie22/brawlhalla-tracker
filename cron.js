const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.database();

// API URL
const API_URL = "https://bhapi.338.rocks/v1/ranked/id?brawlhalla_id=3145331";

// Fetch data from the API
async function fetchPlayerData(brawlhallaId) {
    try {
        // Construct the API URL with the player's ID
        const response = await fetch(`${API_URL.replace("3145331", brawlhallaId)}`);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const fetchedData = await response.json();
        const ratingHolder = fetchedData.data.rating;
        const gamesHolder = fetchedData.data.games;
        const nameHolder = fetchedData.data.name;

        const playerRef = db.ref(`players/${nameHolder}`);

        // Fetch the current data for the player
        const snapshot = await playerRef.once("value");
        const playerData = snapshot.val();

        if (!playerData) {
            // If player does not exist, initialize their data
            const initialData = {
                name: nameHolder,
                rating: [ratingHolder],
                games: [gamesHolder],
                timestamp: [new Date().toISOString()],
            };
            await playerRef.set(initialData);
            console.log(`Initialized data for player: ${nameHolder}`);
        } else {
            // Append new data to existing arrays
            const updatedData = {
                rating: [...(playerData.rating || []), ratingHolder],
                games: [...(playerData.games || []), gamesHolder],
                timestamp: [...(playerData.timestamp || []), new Date().toISOString()],
            };

            await playerRef.update(updatedData);
            console.log(`Appended data for player: ${nameHolder}`);
        }

        // Log the fetched values
        console.log("Player Rating:", ratingHolder);
        console.log("Player Games:", gamesHolder);
    } catch (error) {
        console.error("Error fetching player data:", error);
    }
}

// Cloud function to run every minute
exports.scheduledPlayerDataUpdate = functions.pubsub.schedule("every 1 minutes").onRun(async (context) => {
    console.log("Running update every minute...");
    await fetchPlayerData("9972715"); // Replace with your test player ID
    return null; // Must return a promise or null
});