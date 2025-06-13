require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Dummy data untuk simulasi
const to = "0xDummyBuyer0000000000000000000000000000000";
const value = 1_000_000;
const usd = 253.51;

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const SYMBOL = process.env.TOKEN_SYMBOL;
const WHALE_THRESHOLD = parseInt(process.env.WHALE_THRESHOLD);

const abscanURL = `https://abscan.org/address/${TOKEN_ADDRESS}`;
const dexviewURL = `https://www.dexview.com/abs/${TOKEN_ADDRESS}`;

// Format pesan
let msg;
if (value >= WHALE_THRESHOLD) {
  msg = `🦈 *WHALE BUY ALERT* 🦈\n${value.toLocaleString()} ${SYMBOL} ($${usd})\n👤 \`${to}\`\n` +
        `📈 [Chart](${dexviewURL}) | 🔍 [Abscan](${abscanURL})\n🚀🚀🚀`;
} else {
  msg = `🟢 *Buy Alert* 🟢\n${value.toLocaleString()} ${SYMBOL} ($${usd})\n👤 \`${to}\`\n` +
        `📈 [Chart](${dexviewURL}) | 🔍 [Abscan](${abscanURL})`;
}

// Kirim ke GRUP
bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_GROUP, msg, {
  parse_mode: "Markdown",
  disable_web_page_preview: true,
});

// Kirim ke CHANNEL
bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, msg, {
  parse_mode: "Markdown",
  disable_web_page_preview: true,
});

console.log("✅ Dummy buy alert sent.");
