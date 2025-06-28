require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const volumeLogFile = 'volume-log.json';
const pairAddress = process.env.PAIR_ADDRESS.toLowerCase(); // e.g. 0x44fEa1d92271eb3A72904f80Eb50109b26945149

// === Get price from Dexscreener ===
async function getPriceInfo() {
  try {
    const url = `https://api.dexscreener.com/latest/dex/pairs/abstract/${pairAddress}`;
    const res = await axios.get(url);
    console.log("✅ Dexscreener raw response:", res.data); // 

    const data = res.data?.pair;

    if (!data) {
      throw new Error("Dexscreener pair data not found");
    }

    const ethPrice = parseFloat(data.priceNative);
    const usdPrice = parseFloat(data.priceUsd);

    console.log("🔢 Parsed price:", { ethPrice, usdPrice }); // 

    return {
      ethPrice: ethPrice.toFixed(8),
      usdPrice: usdPrice.toFixed(6),
    };
  } catch (err) {
    console.error('Dexscreener getPriceInfo error:', err.message);
    return {
      ethPrice: '0',
      usdPrice: '0',
    };
  }
}

// === Log whale volume ===
async function logVolume(usdAmount) {
  const now = Date.now();
  let logs = [];

  if (fs.existsSync(volumeLogFile)) {
    logs = JSON.parse(fs.readFileSync(volumeLogFile));
  }

  logs.push({ timestamp: now, usd: usdAmount });
  fs.writeFileSync(volumeLogFile, JSON.stringify(logs, null, 2));
}

// === Calculate 24h Volume ===
async function getDailyVolume() {
  try {
    const now = Date.now();
    let logs = [];

    if (fs.existsSync(volumeLogFile)) {
      logs = JSON.parse(fs.readFileSync(volumeLogFile));
    }

    logs = logs.filter(log => now - log.timestamp <= 24 * 60 * 60 * 1000);
    const totalVolume = logs.reduce((sum, log) => sum + parseFloat(log.usd), 0);
    return totalVolume;
  } catch (err) {
    console.error('getDailyVolume error:', err.message);
    return 0;
  }
}

// === Monitor Pair using Dummy Trigger ===
// Optional: Use polling if needed, else let BuyBot only respond to command
function monitorPair(callback) {
  // Dexscreener doesn't support WebSocket, so this is left intentionally empty.
  // You can implement polling to Dexscreener here if needed.
  console.log("🔍 monitorPair is disabled in Dexscreener mode.");
}

module.exports = {
  getPriceInfo,
  getDailyVolume,
  logVolume,
  monitorPair,
};
