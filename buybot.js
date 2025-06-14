import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import cron from "node-cron";
import { Telegraf } from "telegraf";

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID_GROUP = process.env.TELEGRAM_CHAT_ID_GROUP;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

async function getTokenInfo() {
  const blockNumber = await provider.getBlockNumber();
  return {
    blockNumber,
    token: TOKEN_ADDRESS
  };
}

async function notifyTelegram(message) {
  await bot.telegram.sendMessage(TELEGRAM_CHAT_ID_GROUP, message, {
    parse_mode: "Markdown"
  });
}

async function run() {
  try {
    const info = await getTokenInfo();
    const message = `📢 *BuyBot TRG Update*\nBlock: ${info.blockNumber}\nToken: \`${info.token}\``;
    await notifyTelegram(message);
    console.log("✅ Message sent");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Initial run
run();

// Cron task example (every hour)
cron.schedule("0 * * * *", run);
