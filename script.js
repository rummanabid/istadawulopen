// script.js

/**
 * Get the current time adjusted to Arabian Standard Time (AST, UTC+3)
 */
function getCurrentAST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 3600000);
}

/**
 * Define market trading session times (only the 'Market Open trading session' is used for status)
 * Times are in 24-hour format.
 */
const markets = {
  equity: {
    name: "Equity Markets",
    openStart: { hour: 10, minute: 0 },  // Market Open trading session starts at 10:00 AM
    openEnd: { hour: 15, minute: 0 }     // Market Open trading session ends at 3:00 PM
  },
  etfs: {
    name: "ETFs Market",
    openStart: { hour: 10, minute: 0 },
    openEnd: { hour: 15, minute: 0 }
  },
  sukuk: {
    name: "Sukuk and Bonds Market",
    openStart: { hour: 10, minute: 0 },
    openEnd: { hour: 15, minute: 0 }
  },
  derivatives: {
    name: "Derivatives Market",
    openStart: { hour: 9, minute: 30 },  // Trading session from 9:30 AM
    openEnd: { hour: 15, minute: 30 }    // Ends at 3:30 PM
  }
};

/**
 * Update the status and countdown for a single market.
 * @param {string} marketKey - The key for the market (e.g., "equity").
 */
function updateMarket(marketKey) {
  const market = markets[marketKey];
  const now = getCurrentAST();

  // Build Date objects for today's open and close times in AST
  let openStart = new Date(now);
  openStart.setHours(market.openStart.hour, market.openStart.minute, 0, 0);

  let openEnd = new Date(now);
  openEnd.setHours(market.openEnd.hour, market.openEnd.minute, 0, 0);

  let statusText = "";
  let timerLabel = "";
  let statusColor = "";
  let timerColor = "";
  let targetTime;

  // Determine if the current time falls within the Market Open trading session
  if (now >= openStart && now < openEnd) {
    // When trading session is active, market is considered "open"
    statusText = "Market Open";
    timerLabel = "Market closing in: ";
    statusColor = "green";
    timerColor = "green";
    targetTime = openEnd;
  } else {
    // Outside the trading session, market is considered "closed"
    statusText = "Market Closed";
    timerLabel = "Market opening in: ";
    statusColor = "red";
    timerColor = "red";
    
    // If before today's open session, target is today's openStart; if after, then it's tomorrow's openStart.
    if (now < openStart) {
      targetTime = openStart;
    } else {
      targetTime = new Date(openStart);
      targetTime.setDate(openStart.getDate() + 1);
    }
  }

  // Update the status element
  const statusElement = document.getElementById(`status-${marketKey}`);
  statusElement.innerText = statusText;
  statusElement.style.color = statusColor;

  // Calculate the countdown timer values
  const countdownElement = document.getElementById(`timer-${marketKey}`);
  let distance = targetTime.getTime() - now.getTime();
  if (distance < 0) { distance = 0; }
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  // Update the timer element with the appropriate message and color
  countdownElement.innerText = `${timerLabel}${hours}h ${minutes}m ${seconds}s`;
  countdownElement.style.color = timerColor;
}

/**
 * Update the status and timer for all markets.
 */
function updateAllMarkets() {
  for (let key in markets) {
    updateMarket(key);
  }
}

// Initial update
updateAllMarkets();

// Update every second for a live countdown
setInterval(updateAllMarkets, 1000);
