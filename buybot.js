import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import cron from 'node-cron';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Static Token Info
const price = '0.00012 ETH';
const volume = '$23,400';
const contract = process.env.TOKEN_ADDRESS || '0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD';
const chartURL = `https://dexview.com/abs/${contract}`;
const abscanURL = `https://abscan.org/address/${contract}`;
const supply = '1,000,000,000 TRG';
const launchDate = 'June 15, 2025';
const whales = '3 whales were active in the last 24 hours.';

// Bot Commands
bot.start((ctx) => {
  ctx.replyWithHTML(
    `👋 Welcome to <b>BuyBot TRG</b>!\n\nUse <code>/help</code> to see all available commands.`
  );
});

bot.command('help', (ctx) => {
  ctx.replyWithHTML(
    `📘 <b>BuyBot TRG Command List:</b>\n
/price - Check current TRG price
/volume - 24-hour trading volume
/contract - View TRG contract address
/chart - DEX chart link
/supply - TRG total supply
/launch - Launch date info
/whales - Whale activity

/liquidity - Liquidity info
/holders - Total holders
/burn - Burned token info
/faq - Common questions answered`
  );
});

bot.command('price', (ctx) => {
  ctx.reply(`📈 TRG Current Price: ${price}`);
});

bot.command('volume', (ctx) => {
  ctx.reply(`🔁 24h Volume: ${volume}`);
});

bot.command('contract', (ctx) => {
  ctx.reply(`📄 TRG Contract:\n${contract}`);
});

bot.command('chart', (ctx) => {
  ctx.reply(`📊 DEX Chart:\n${chartURL}`);
});

bot.command('supply', (ctx) => {
  ctx.reply(`💰 Total Supply: ${supply}`);
});

bot.command('launch', (ctx) => {
  ctx.reply(`🚀 Launch Date: ${launchDate}`);
});

bot.command('whales', (ctx) => {
  ctx.reply(`🐋 Whale Update:\n${whales}`);
});

bot.command('liquidity', (ctx) => {
  ctx.replyWithHTML(`💧 <b>Liquidity Info</b>\n\nCurrently over <b>$10,000</b> liquidity locked.\n\n🔗 <a href="${chartURL}">View on DEX</a>`);
});

bot.command('holders', (ctx) => {
  ctx.replyWithHTML(`👥 <b>Holders</b>\n\nMore than <b>1,200 holders</b> and growing!\n\n🔗 <a href="https://abscan.org/token/${contract}#holders">View Holders</a>`);
});

bot.command('burn', (ctx) => {
  ctx.replyWithHTML(`🔥 <b>Burn Info</b>\n\nOver <b>150,000,000 TRG</b> has been burned.\n\n🔗 <a href="https://abscan.org/token/${contract}#tokenAnalytics">Burn Details</a>`);
});

bot.command('faq', (ctx) => {
  ctx.replyWithHTML(`📌 <b>FAQ</b>\n\n<b>Q:</b> Is liquidity locked?\n<b>A:</b> Yes, for 1 year.\n\n<b>Q:</b> Fair launch?\n<b>A:</b> Yes, 100% fair, no presale.\n\n<b>Q:</b> Where to buy?\n<b>A:</b> Abstract DEX\n\n<b>Q:</b> Chart?\n<b>A:</b> /chart or <a href="${chartURL}">DEXView</a>`);
});

// Scheduled Daily Broadcast at 13:00 UTC (20:00 WIB)
const dailyMessage = `🚀 <b>TRILLION GAME (TRG) IS NOW LIVE!</b>

💰 <b>Start trading now:</b>  
🔗 <a href="https://dexview.com/abs/${contract}">DEX Chart</a> | <a href="https://abscan.org/address/${contract}">Abscan</a>

📄 <b>Contract:</b>  
<code>${contract}</code>

🎯 <b>Supply:</b> 1,000,000,000 TRG  
🧠 <i>"One Game. One Winner. One Trillion."</i>

⚠️ <b>Warning:</b> <i>Do NOT buy this token if you are rich. WEALTHY ONLY...</i> 💸🔥`;

cron.schedule('0 13 * * *', async () => {
  try {
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, dailyMessage, {
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    });
    console.log('✅ Scheduled broadcast sent!');
  } catch (err) {
    console.error('❌ Failed to send scheduled broadcast:', err.message || err);
  }
});

// Start Bot
bot.launch();
console.log('🤖 BuyBot TRG is running...');
