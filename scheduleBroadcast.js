require("dotenv").config();
const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const message = `📣 <b>GM!</b>\nRemember to check <a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">TRG Chart</a> & <a href="https://abscan.org/address/${process.env.TOKEN_ADDRESS}">Abscan</a> 🚀`;

cron.schedule("0 13 * * *", async () => {
  try {
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
      parse_mode: "HTML",
      disable_web_page_preview: false
    });
    console.log("⏰ Scheduled broadcast sent at 20:00 WIB.");
  } catch (err) {
    console.error("❌ Failed to send scheduled broadcast:", err);
  }
});

console.log("🕒 scheduleBroadcast.js is running...");
