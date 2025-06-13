require("dotenv").config();
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const axios = require("axios");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function fetchVolumeData() {
  const token = process.env.TOKEN_ADDRESS.toLowerCase();
  try {
    const res = await axios.get(`https://api.dexview.com/pairs/abs/${token}`);
    const vol = res.data.pair.volumeUsd24h || 0;
    const volEth = res.data.pair.volumeEth24h || 0;

    return {
      usd: Number(vol).toLocaleString("en-US", { maximumFractionDigits: 0 }),
      eth: Number(volEth).toFixed(2)
    };
  } catch (err) {
    console.error("❌ Failed to fetch volume data:", err.message);
    return { usd: "N/A", eth: "N/A" };
  }
}

cron.schedule("0 13 * * *", async () => {
  const { usd, eth } = await fetchVolumeData();
  const msg = `📊 <b>TRG Volume Hari Ini:</b>\n💰 ${eth} ETH ($${usd})\n<a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">Chart</a> | <a href="https://abscan.org/address/${process.env.TOKEN_ADDRESS}">Abscan</a>`;

  try {
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, msg, {
      parse_mode: "HTML",
      disable_web_page_preview: false
    });
    console.log("📊 Volume update sent.");
  } catch (err) {
    console.error("❌ Failed to send volume report:", err.message);
  }
});

console.log("📈 volumeReporter.js is running...");
