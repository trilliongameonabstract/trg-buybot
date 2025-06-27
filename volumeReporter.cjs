require('dotenv').config();
const { getDailyVolume } = require('./trackers.cjs');
const { Telegraf } = require('telegraf');

(async () => {
  try {
    const volume = await getDailyVolume();
    console.log(`📊 24h Volume: $${volume.toLocaleString()}`);

    if (process.env.TELEGRAM_BOT_TOKEN) {
      const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

      const message = `📊 <b>Daily TRG Volume Report</b>

🔁 24h Volume: <b>$${volume.toLocaleString()}</b>  
💎 Keep watching the flow.

#TRG #TrillionGame #VolumeBot`;

      const targets = [
        process.env.TELEGRAM_CHAT_ID_CHANNEL,
        process.env.TELEGRAM_CHAT_ID_GROUP,
      ].filter(Boolean);

      for (const chatId of targets) {
        await bot.telegram.sendMessage(chatId, message, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
        console.log(`✅ Volume sent to: ${chatId}`);
      }
    } else {
      console.log('ℹ️ Telegram bot token not set. Skipping broadcast.');
    }

  } catch (err) {
    console.error('❌ Failed to report volume:', err.message || err);
  }
})();
