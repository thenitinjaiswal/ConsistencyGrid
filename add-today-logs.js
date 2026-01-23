// Quick script to add habit logs for today
import fetch from 'node-fetch';

const userId = "6f5263f3-3de1-440f-bcf3-f85b02649f84"; // This is the user ID from the logs
const habitIds = [
  "cmknjshob000dsxtku1hdqtb3", // Read
  "cmknjshob000esxtkkcxp8xd0", // Water
  "cmknjshob000fsxtk7ivjg6ku", // Journal
];

const today = new Date().toISOString().split("T")[0];
console.log(`Adding logs for today: ${today}`);

async function addLogs() {
  for (const habitId of habitIds) {
    try {
      const response = await fetch("http://localhost:3000/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date: today,
        }),
      });
      
      const data = await response.json();
      console.log(`Created log for habit ${habitId}:`, data);
    } catch (error) {
      console.error(`Error creating log for ${habitId}:`, error);
    }
  }
  
  console.log("Done!");
}

addLogs();
