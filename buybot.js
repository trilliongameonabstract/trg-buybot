require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const { sendBuyNotification } = require('./broadcast.cjs');
const { monitorPair } = require('./trackers.js');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('BuyBot TRG is alive! 🚀');
});

const app = express();
app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_BOT_TOKEN}`));

const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
bot.telegram.setWebhook(webhookUrl).then(() => {
  console.log(`🌐 BuyBot TRG is running via Webhook on port ${process.env.PORT || 8080}`);
}).catch((err) => {
  console.error('❌ Bot launch error:', err.description || err);
});

monitorPair((buyData) => {
  sendBuyNotification(buyData);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Express server started on port ${PORT}`);
});
