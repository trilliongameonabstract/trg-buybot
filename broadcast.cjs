require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function sendBuyNotification(data) {
  const message = `
🚨 <b>Whale Buy Alert</b>

💰 USD Value: <b>$${data.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</b>  
📥 Buyer: <code>${data.buyer}</code>  
📤 Recipient: <code>${data.recipient}</code>  
🔗 <a href="https://abscan.org/address/${data.recipient}">View Wallet</a>

#TRG #WhaleBuy #TrillionGame
`;

  try {
    if (process.env.TELEGRAM_CHAT_ID_GROUP) {
      await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_GROUP, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }

    if (process.env.TELEGRAM_CHAT_ID_CHANNEL) {
      await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID_CHANNEL, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }

    console.log('📢 Buy alert sent successfully!');
  } catch (err) {
    console.error('❌ Failed to send buy alert:', err.message || err);
  }
}

module.exports = {
  sendBuyNotification,
};
