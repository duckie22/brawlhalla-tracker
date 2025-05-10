const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // Ensure node-fetch@2 is installed

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.database();

// List of user IDs
const userIDs = ["10011398", "9972715"];

exports.scheduledPlayerDataUpdate = functions.pubsub.schedule("every 15 minutes").onRun(async (context) => {
    console.log("Scheduled function triggered...");
    try {
        for (const userID of userIDs) {
            const API_URL = `https://api.brawlhalla.com/player/${userID}/ranked?api_key=SVT4VGIRAY8UUQ2ZESIV`;
            console.log("Sending API request to:", API_URL);

            try {
                const response = await fetch(API_URL);
                console.log(`Response status code for user ${userID}:`, response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data for user ${userID}: ${response.statusText}`);
                }

                const fetchedData = await response.json();
                const rating = fetchedData.rating;
                const games = fetchedData.games;
                const name = fetchedData.name;

                const playerRef = db.ref(`players/${name}`);
                const snapshot = await playerRef.once("value");
                const playerData = snapshot.val();

                if (!playerData) {
                    await playerRef.set({
                        name,
                        rating: [rating],
                        games: [games],
                        timestamp: [new Date().toISOString()],
                    });
                    console.log(`Initialized data for player: ${name}`);
                } else {
                    await playerRef.update({
                        rating: [...(playerData.rating || []), ...(rating ? [rating] : [])],
                        games: [...(playerData.games || []), games],
                        timestamp: [...(playerData.timestamp || []), new Date().toISOString()],
                    });
                    console.log(`Updated data for player: ${name}`);
                }
            } catch (error) {
                console.error(`Error fetching data for user ${userID}:`, error);
            }
        }
    } catch (error) {
        console.error("Error in scheduled function:", error);
    }
});