require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const message = process.argv.slice(2).join(" ");

if (!message) {
  console.error("❌ Please provide a message to send.");
  process.exit(1);
}

bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
  parse_mode: "HTML",
  disable_web_page_preview: false
}).then(() => {
  console.log("📢 Broadcast sent successfully!");
  process.exit(0);
}).catch(err => {
  console.error("❌ Failed to send broadcast:", err.description || err);
  process.exit(1);
});
