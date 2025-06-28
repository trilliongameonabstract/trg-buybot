require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const { sendBuyNotification } = require('./broadcast.cjs');
const { monitorPair, getPriceInfo, getDailyVolume } = require('./trackers.cjs');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// === BOT COMMANDS ===
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
  ctx.replyWithHTML(`📈 <b>TRG Chart</b>\n<a href="https://dexscreener.com/abstract/${process.env.PAIR_ADDRESS}">Click here to view on Dexscreener</a>`);
});

bot.command('supply', (ctx) => {
  ctx.reply('🪙 Total Supply: 1,000,000,000 TRG');
});

bot.command('launch', (ctx) => {
  ctx.replyWithHTML(`
🚀 <b>Launch Info</b>  
🗓️ June 26, 2025  
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
🔗 <a href="https://dexscreener.com/abstract/${process.env.PAIR_ADDRESS}">View on Dexscreener</a>
`);
});

bot.command('holders', (ctx) => {
  ctx.reply('👥 <b>TRG Holder</b>\n<a href="https://dexscreener.com/abstract/${process.env.PAIR_ADDRESS}'); Click here to view on Dexscreener</a>`);
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

// === START BOT IN POLLING MODE ===
bot.launch().then(() => {
  console.log('✅ BuyBot TRG is running in polling mode.');
}).catch((err) => {
  console.error('❌ Error launching bot:', err);
});

// === MONITOR BUY TRANSACTIONS ===
console.log('🔍 Listening to real pair on-chain...');
try {
  monitorPair((buyData) => {
    sendBuyNotification(buyData);
  });
} catch (err) {
  console.error("❌ Error in monitorPair:", err);
}

// === EXPRESS SERVER FOR RAILWAY KEEP-ALIVE ===
const app = express();
const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("✅ BuyBot TRG is alive (polling mode)."));
app.listen(PORT, () => {
  console.log(`🌐 Express server started on port ${PORT}`);
});
