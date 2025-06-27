require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const { sendBuyNotification } = require('./broadcast.cjs');
const { monitorPair, getPriceInfo, getDailyVolume } = require('./trackers.cjs');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// === COMMAND HANDLERS ===
bot.command('start', (ctx) => {
  ctx.reply('🚀 BuyBot TRG is alive!\nType /help to see all available commands.');
});

bot.command('help', (ctx) => {
  ctx.replyWithHTML(`
📚 <b>TRG Bot Command List</b>

/price - Check current TRG price  
/volume - 24h trading volume  
/contract - View contract address  
/chart - DEX chart link  
/supply - Token total supply  
/launch - Launch info  
/whales - Whale warning & threshold  
/liquidity - LP pair info  
/holders - Token holders info  
/burn - Burn info  
/faq - General TRG FAQs  
`);
});

bot.command('price', async (ctx) => {
  try {
    const price = await getPriceInfo();
    ctx.reply(`💰 TRG Price: $${price.usdPrice} (${price.ethPrice} ETH)`);
  } catch (err) {
    ctx.reply('❌ Failed to fetch price.');
    console.error(err);
  }
});

bot.command('volume', async (ctx) => {
  try {
    const volume = await getDailyVolume();
    ctx.reply(`📊 24h Volume: $${volume.toLocaleString()}`);
  } catch (err) {
    ctx.reply('❌ Failed to fetch volume.');
    console.error(err);
  }
});

bot.command('contract', (ctx) => {
  ctx.replyWithHTML(`
📄 <b>TRG Contract Address</b>  
<code>${process.env.TOKEN_ADDRESS}</code>  
🔗 <a href="https://abscan.org/address/${process.env.TOKEN_ADDRESS}">View on Abscan</a>
  `);
});

bot.command('chart', (ctx) => {
  ctx.replyWithHTML(`📈 <b>TRG Chart</b>\n<a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">Click here to view on DEXView</a>`);
});

bot.command('supply', (ctx) => {
  ctx.reply('🪙 Total Supply: 1,000,000,000 TRG');
});

bot.command('launch', (ctx) => {
  ctx.replyWithHTML(`
🚀 <b>Launch Info</b>  
🗓️ June 28, 2025  
📦 Initial Supply: 1B  
🔥 0% Tax | 100% LP Burn  
`);
});

bot.command('whales', (ctx) => {
  ctx.replyWithHTML(`🐋 <b>Whale Warning</b>\nIf someone buys > <b>$${parseFloat(process.env.WHALE_THRESHOLD).toLocaleString()}</b>, we post it here.`);
});

bot.command('liquidity', (ctx) => {
  ctx.replyWithHTML(`
💧 <b>Liquidity Pool</b>  
Pair Address:  
<code>${process.env.PAIR_ADDRESS}</code>  
🔗 <a href="https://abscan.org/address/${process.env.PAIR_ADDRESS}">View on Abscan</a>
  `);
});

bot.command('holders', (ctx) => {
  ctx.reply('👥 Holders info is not yet tracked. Stay tuned for future updates!');
});

bot.command('burn', (ctx) => {
  ctx.reply('🔥 LP was burned at launch. No further burns scheduled for now.');
});

bot.command('faq', (ctx) => {
  ctx.replyWithHTML(`
❓ <b>TRG FAQ</b>

<b>Q:</b> Is this token safe?  
<b>A:</b> Contract is verified & LP is burned.

<b>Q:</b> Is it community-owned?  
<b>A:</b> Yes. Dev renounced control, zero tax.

<b>Q:</b> Why the name "Trillion Game"?  
<b>A:</b> Because it's One Game. One Winner. One Trillion.

More coming soon...
  `);
});

// === EXPRESS WEBHOOK SETUP ===
const app = express();
app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_BOT_TOKEN}`));

const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
bot.telegram.setWebhook(webhookUrl).then(() => {
  console.log(`🌐 BuyBot TRG is running via Webhook on port ${process.env.PORT || 8080}`);
}).catch((err) => {
  console.error('❌ Bot launch error:', err.description || err);
});

// === START MONITORING PAIR ===
console.log('🔍 Listening to real pair on-chain...');
monitorPair((buyData) => {
  sendBuyNotification(buyData);
});

// === START SERVER ===
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Express server started on port ${PORT}`);
});
