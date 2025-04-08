// script.js

/**
 * Returns the current date and time adjusted to Arabian Standard Time (AST, UTC+3)
 */
function getCurrentAST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 3600000);
}

// Define trading hours common to all markets (10:00 AM to 3:00 PM AST)
const openHour = 10;
const openMinute = 0;
const closeHour = 15;
const closeMinute = 0;

/**
 * Updates the market status and sets the countdown timer.
 * - During market open (10:00 AM ≤ now < 3:00 PM): Displays “Market Open” in green and counts down to closing.
 * - Outside market hours: Displays “Market Closed” in red and counts down to the next day’s market opening.
 */
function updateMarketStatus() {
  const now = getCurrentAST();
  const statusElement = document.getElementById("market-status");
  const countdownElement = document.getElementById("countdown");
  let targetTime;
  let statusText;
  let timerLabel;
  
  // Create Date objects for today’s open and close times
  const openTime = new Date(now);
  openTime.setHours(openHour, openMinute, 0, 0);
  
  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMinute, 0, 0);
  
  // Check if the market is open
  if (now >= openTime && now < closeTime) {
    statusText = "Market Open";
    timerLabel = "Market closing in: ";
    targetTime = closeTime;
    statusElement.style.color = "green";
    countdownElement.style.color = "green";
  } else {
    statusText = "Market Closed";
    timerLabel = "Market opening in: ";
    statusElement.style.color = "red";
    countdownElement.style.color = "red";
    
    // If it's before today’s opening time, count down to today’s open; if after, count down to tomorrow’s open.
    if (now < openTime) {
      targetTime = openTime;
    } else {
      targetTime = new Date(openTime);
      targetTime.setDate(openTime.getDate() + 1);
    }
  }
  
  statusElement.innerText = statusText;
  
  // Calculate the remaining time until the target time
  let distance = targetTime.getTime() - now.getTime();
  if (distance < 0) { distance = 0; }
  
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);
  
  countdownElement.innerText = timerLabel + `${hours}h ${minutes}m ${seconds}s`;
}

// Update the market status and countdown immediately
updateMarketStatus();

// Update the countdown every second
setInterval(updateMarketStatus, 1000);
