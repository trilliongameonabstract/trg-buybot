require('dotenv').config();
const { getDailyVolume } = require('./trackers.cjs');

(async () => {
  const volume = await getDailyVolume();
  console.log(`📊 24h Volume (Manual Check): $${volume.toLocaleString()}`);
})();
