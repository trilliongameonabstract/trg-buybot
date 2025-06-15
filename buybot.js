import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Sample response data – ganti dengan real-time fetch jika dibutuhkan
const price = '0.00012 ETH';
const volume = '$23,400';
const contract = process.env.TOKEN_ADDRESS || '0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD';
const chartURL = `https://dexview.com/abs/${contract}`;
const abscanURL = `https://abscan.org/address/${contract}`;
const supply = '1,000,000,000 TRG';
const launchDate = '15 Juni 2025';
const whales = '3 whale active dalam 24 jam terakhir.';

bot.start((ctx) =>
  ctx.replyWithHTML(
    `👋 Selamat datang di <b>BuyBot TRG</b>!\n\nGunakan <code>/help</code> untuk melihat semua command yang tersedia.`
  )
);

bot.command('help', (ctx) => {
  ctx.replyWithHTML(
    `📘 <b>Daftar Perintah BuyBot TRG:</b>\n
/price - Lihat harga TRG terbaru
/volume - Volume transaksi 24 jam
/contract - Alamat kontrak TRG
/chart - Link chart DEX
/supply - Total supply TRG
/launch - Info tanggal launching
/whales - Aktivitas whale terbaru`
  );
});

bot.command('price', (ctx) => {
  ctx.reply(`📈 Harga TRG saat ini: ${price}`);
});

bot.command('volume', (ctx) => {
  ctx.reply(`🔁 Volume 24 jam: ${volume}`);
});

bot.command('contract', (ctx) => {
  ctx.reply(`📄 Alamat Kontrak TRG:\n${contract}`);
});

bot.command('chart', (ctx) => {
  ctx.reply(`📊 Chart TRG:\n${chartURL}`);
});

bot.command('supply', (ctx) => {
  ctx.reply(`💰 Total Supply TRG: ${supply}`);
});

bot.command('launch', (ctx) => {
  ctx.reply(`🚀 TRG Launch Date: ${launchDate}`);
});

// /liquidity
bot.command("liquidity", (ctx) => {
  ctx.replyWithHTML(`💧 <b>Liquidity Info</b>\n\nCurrent liquidity is approximately <b>$10,000+</b> locked on DEX.\n\n🔗 <a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">View on DEX</a>`);
});

// /holders
bot.command("holders", (ctx) => {
  ctx.replyWithHTML(`👥 <b>Holders Info</b>\n\nTRG currently has more than <b>1,200 holders</b> and growing!\n\n🔗 <a href="https://abscan.org/token/${process.env.TOKEN_ADDRESS}#holders">View on Abscan</a>`);
});

// /burn
bot.command("burn", (ctx) => {
  ctx.replyWithHTML(`🔥 <b>Burn Info</b>\n\nA total of <b>150,000,000 TRG</b> has been burned so far.\n\n🔗 <a href="https://abscan.org/token/${process.env.TOKEN_ADDRESS}#tokenAnalytics">Burn Details</a>`);
});

// /faq
bot.command("faq", (ctx) => {
  ctx.replyWithHTML(`📌 <b>TRG Token FAQ</b>\n\n<b>Q:</b> Is liquidity locked?\n<b>A:</b> Yes, for 1 year.\n\n<b>Q:</b> Is TRG a fair launch?\n<b>A:</b> 100% fair launch. No presale.\n\n<b>Q:</b> Where to trade?\n<b>A:</b> On Abstract DEX. \n\n<b>Q:</b> How to check charts?\n<b>A:</b> Use /chart or visit <a href="https://dexview.com/abs/${process.env.TOKEN_ADDRESS}">DEXView</a>`);
});

bot.command('whales', (ctx) => {
  ctx.reply(`🐋 Whale Update:\n${whales}`);
});

// Jalankan bot
bot.launch();
console.log('🤖 BuyBot TRG is running...');
