import dotenv from 'dotenv';
import cron from 'node-cron';
import { getDailyVolume } from './trackers.js';
import { Telegraf } from 'telegraf';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

cron.schedule('0 13 * * *', async () => {
  try {
    const volume = await getDailyVolume();

    const message = `📊 <b>Daily TRG Volume Report</b>

🔁 24h Volume: <b>$${volume.toLocaleString()}</b>  
💎 Keep watching the flow.

#TRG #TrillionGame #VolumeBot`;

    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });

    console.log('✅ Daily volume report sent!');
  } catch (error) {
    console.error('❌ Failed to send volume report:', error.message || error);
  }
});
