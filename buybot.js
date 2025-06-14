require("dotenv").config();
const { ethers } = require("ethers");
const { Telegraf } = require("telegraf");
const { getUSDValue } = require("./utils");
const { trackBuyer, getTopBuyers } = require("./trackers");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS.toLowerCase();
const PAIR_ADDRESS = process.env.PAIR_ADDRESS.toLowerCase();
const SYMBOL = process.env.TOKEN_SYMBOL;
const DECIMALS = Number(process.env.TOKEN_DECIMALS);
const WHALE_THRESHOLD = parseFloat(process.env.WHALE_THRESHOLD);

// === Listener ===
const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const contract = new ethers.Contract(TOKEN_ADDRESS, abi, provider);

console.log("📡 BuyBot is live...");

contract.on("Transfer", async (from, to, amount) => {
  from = from.toLowerCase();
  to = to.toLowerCase();

  if (from === PAIR_ADDRESS) {
    const value = parseFloat(ethers.utils.formatUnits(amount, DECIMALS));
    const usd = await getUSDValue(value);
    await trackBuyer(to, value);

    const abscanURL = `https://abscan.org/address/${TOKEN_ADDRESS}`;
    const dexviewURL = `https://www.dexview.com/abs/${TOKEN_ADDRESS}`;

    let msg = `🟢 *Buy Alert* 🟢\n` +
              `${value.toLocaleString()} ${SYMBOL} ($${usd})\n` +
              `👤 \`${to}\`\n` +
              `📈 [Chart](${dexviewURL}) | 🔍 [Abscan](${abscanURL})`;

    if (value >= WHALE_THRESHOLD) {
      msg = `🦈 *WHALE BUY ALERT* 🦈\n` +
            `${value.toLocaleString()} ${SYMBOL} ($${usd})\n` +
            `👤 \`${to}\`\n` +
            `📈 [Chart](${dexviewURL}) | 🔍 [Abscan](${abscanURL})\n🚀🚀🚀`;

      await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, msg, {
        parse_mode: "Markdown",
        disable_web_page_preview: true
      });
    }

    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_GROUP, msg, {
      parse_mode: "Markdown",
      disable_web_page_preview: true
    });

    const leaderboard = getTopBuyers(3);
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_GROUP, leaderboard, {
      parse_mode: "Markdown"
    });
  }
});
