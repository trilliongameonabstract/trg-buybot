import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const price = '0.00012 ETH';
const volume = '$23,400';
const contract = process.env.TOKEN_ADDRESS || '0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD';
const chartURL = `https://dexview.com/abs/${contract}`;
const abscanURL = `https://abscan.org/address/${contract}`;
const supply = '1,000,000,000 TRG';
const launchDate = 'June 15, 2025';
const whales = '3 whale transactions detected in the last 24 hours.';

bot.start((ctx) =>
  ctx.replyWithHTML(
    `👋 Welcome to <b>BuyBot TRG</b>!\n\nUse <code>/help</code> to view all available commands.`
  )
);

bot.command('help', (ctx) => {
  ctx.replyWithHTML(
    `📘 <b>Available BuyBot TRG Commands:</b>\n
/price - View latest TRG price
/volume - 24-hour transaction volume
/contract - TRG contract address
/chart - DEX chart link
/supply - Total TRG supply
/launch - Launch date info
/whales - Recent whale activity
/liquidity - Liquidity status
/holders - Token holders count
/burn - Burned token stats
/faq - Frequently Asked Questions`
  );
});

bot.command('price', (ctx) => {
  ctx.reply(`📈 Current TRG price: ${price}`);
});

bot.command('volume', (ctx) => {
  ctx.reply(`🔁 24H Volume: ${volume}`);
});

bot.command('contract', (ctx) => {
  ctx.reply(`📄 TRG Contract Address:\n${contract}`);
});

bot.command('chart', (ctx) => {
  ctx.reply(`📊 TRG Chart:\n${chartURL}`);
});

bot.command('supply', (ctx) => {
  ctx.reply(`💰 Total TRG Supply: ${supply}`);
});

bot.command('launch', (ctx) => {
  ctx.reply(`🚀 Launch Date: ${launchDate}`);
});

bot.command('whales', (ctx) => {
  ctx.reply(`🐋 Whale Activity:\n${whales}`);
});

// /liquidity
bot.command("liquidity", (ctx) => {
  ctx.replyWithHTML(`💧 <b>Liquidity Status</b>\n\nCurrent liquidity is approximately <b>$10,000+</b> locked on DEX.\n\n🔗 <a href="https://dexview.com/abs/${contract}">View on DEX</a>`);
});

// /holders
bot.command("holders", (ctx) => {
  ctx.replyWithHTML(`👥 <b>Holders Info</b>\n\nTRG currently has more than <b>1,200 holders</b> and is growing!\n\n🔗 <a href="https://abscan.org/token/${contract}#holders">View on Abscan</a>`);
});

// /burn
bot.command("burn", (ctx) => {
  ctx.replyWithHTML(`🔥 <b>Burn Stats</b>\n\nA total of <b>150,000,000 TRG</b> has been burned.\n\n🔗 <a href="https://abscan.org/token/${contract}#tokenAnalytics">View Burn Details</a>`);
});

// /faq
bot.command("faq", (ctx) => {
  ctx.replyWithHTML(`📌 <b>TRG Token FAQ</b>\n\n<b>Q:</b> Is liquidity locked?\n<b>A:</b> Yes, for 1 year.\n\n<b>Q:</b> Is this a fair launch?\n<b>A:</b> 100% fair launch. No presale.\n\n<b>Q:</b> Where to trade TRG?\n<b>A:</b> On Abstract DEX.\n\n<b>Q:</b> Where to see the chart?\n<b>A:</b> Use /chart or visit <a href="https://dexview.com/abs/${contract}">DEXView</a>`);
});

// Start the bot
bot.launch();
console.log('🤖 BuyBot TRG is running...');
