import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Sends a message to both Telegram group and channel
 * @param {string} message - The message to send
 */
export async function sendTelegramMessage(message) {
  try {
    const options = {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    };

    if (process.env.TELEGRAM_CHAT_ID_GROUP) {
      await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_GROUP, message, options);
    }

    if (process.env.TELEGRAM_CHAT_ID_CHANNEL) {
      await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, options);
    }

    console.log('📨 Message sent to Telegram group & channel');
  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error.message || error);
  }
}
