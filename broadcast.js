require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Pesan broadcast manual
const message = `🚀 <b>TRILLION GAME (TRG) IS NOW LIVE!</b>

💰 <b>Start trading now:</b>  
🔗 <a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">DEX Chart</a> | <a href="https://abscan.org/address/${process.env.TOKEN_ADDRESS}">Abscan</a>

📄 <b>Contract:</b>  
<code>${process.env.TOKEN_ADDRESS}</code>

🎯 <b>Supply:</b> 1,000,000,000 TRG  
🧠 <i>"One Game. One Winner. One Trillion."</i>

⚠️ <b>Warning:</b> <i>Do NOT buy this token if you have too much money. It's only for fearless PvP warriors...</i> 💸🔥`;

bot.telegram
  .sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
    parse_mode: "HTML",
    disable_web_page_preview: false,
  })
  .then(() => {
    console.log("📢 Broadcast sent successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to send broadcast:", err);
    process.exit(1);
  });
