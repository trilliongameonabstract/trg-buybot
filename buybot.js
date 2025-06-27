import dotenv from 'dotenv';
import express from 'express';
import { Telegraf } from 'telegraf';
import { sendBuyNotification } from './broadcast.cjs';

dotenv.config();

// === Setup Telegram Bot ===
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Command handler (optional)
bot.command('start', (ctx) => {
  ctx.reply('BuyBot TRG is alive! 🚀');
});

// === Setup Express App for Webhook ===
const app = express();
app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_BOT_TOKEN}`));

// Set Telegram webhook
const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
bot.telegram.setWebhook(webhookUrl).then(() => {
  console.log(`🌐 BuyBot TRG is running via Webhook on port ${process.env.PORT || 8080}`);
}).catch((err) => {
  console.error('❌ Bot launch error:', err.description || err);
});

// Start monitoring buy transactions
monitorPair((buyData) => {
  sendBuyNotification(buyData);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Express server started on port ${PORT}`);
});
