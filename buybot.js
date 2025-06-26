import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import { getPriceInfo, getDailyVolume } from './trackers.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// === Static Data ===
const contract = process.env.TOKEN_ADDRESS;
const chartURL = `https://dexview.com/abs/${contract}`;
const abscanURL = `https://abscan.org/address/${contract}`;
const supply = '1,000,000,000 TRG';
const launchDate = 'June 15, 2025';

// === Command Handlers ===
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

bot.command('price', async (ctx) => {
  const priceInfo = await getPriceInfo();
  ctx.reply(`📈 TRG Price:\n$${priceInfo.usdPrice} USD\n(${priceInfo.ethPrice} ETH)`);
});

bot.command('volume', async (ctx) => {
  const volume = await getDailyVolume();
  ctx.reply(`🔁 24h Volume: $${volume.toLocaleString()}`);
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
  ctx.reply(`🐋 Whale Update:\n3 whales were active in the last 24 hours.`);
});

bot.command('liquidity', (ctx) => {
  ctx.replyWithHTML(`💧 <b>Liquidity Info</b>\n\nOver <b>$10,000</b> liquidity locked.\n🔗 <a href="${chartURL}">View on DEX</a>`);
});

bot.command('holders', (ctx) => {
  ctx.replyWithHTML(`👥 <b>Holders</b>\n\nMore than <b>1,200 holders</b> and growing!\n🔗 <a href="https://abscan.org/token/${contract}#holders">View Holders</a>`);
});

bot.command('burn', (ctx) => {
  ctx.replyWithHTML(`🔥 <b>Burn Info</b>\n\nOver <b>150,000,000 TRG</b> has been burned.\n🔗 <a href="https://abscan.org/token/${contract}#tokenAnalytics">Burn Details</a>`);
});

bot.command('faq', (ctx) => {
  ctx.replyWithHTML(`📌 <b>FAQ</b>\n\n<b>Q:</b> Is liquidity locked?\n<b>A:</b> Yes, for 1 year.\n\n<b>Q:</b> Fair launch?\n<b>A:</b> Yes, 100% fair, no presale.\n\n<b>Q:</b> Where to buy?\n<b>A:</b> Abstract DEX\n\n<b>Q:</b> Chart?\n<b>A:</b> /chart or <a href="${chartURL}">DEXView</a>`);
});

// === Daily Broadcast at 13:00 UTC ===
cron.schedule('0 13 * * *', async () => {
  try {
    const priceInfo = await getPriceInfo();
    const volume = await getDailyVolume();

    const message = `🚀 <b>TRILLION GAME (TRG) IS LIVE!</b>

💰 <b>Price:</b> $${priceInfo.usdPrice}  
🔁 <b>24h Volume:</b> $${volume.toLocaleString()}

📄 <b>Contract:</b>  
<code>${contract}</code>

🔗 <a href="${chartURL}">DEX Chart</a> | <a href="${abscanURL}">Abscan</a>  
🎯 <b>Supply:</b> ${supply}

🧠 <i>"One Game. One Winner. One Trillion."</i>

⚠️ <b>Warning:</b> <i>Do NOT buy this token if you are rich. WEALTHY ONLY...</i> 💸🔥`;

    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    });

    console.log('✅ Daily broadcast sent!');
  } catch (err) {
    console.error('❌ Failed to send daily broadcast:', err.message || err);
  }
});

// === Webhook Launch ===
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.WEBHOOK_DOMAIN;

bot.telegram.setWebhook(`${DOMAIN}/bot${process.env.TELEGRAM_BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, null, PORT);

console.log(`🌐 BuyBot TRG is running via Webhook on port ${PORT}`);
