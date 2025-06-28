require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');
const IERC20ABI = require('./interfaces/IERC20.json');
const IUniswapV2PairABI = require('./interfaces/IUniswapV2Pair.json');

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.RPC_URL));
const pairAddress = process.env.PAIR_ADDRESS.toLowerCase();
const tokenAddress = process.env.TOKEN_ADDRESS.toLowerCase();
const volumeLogFile = 'volume-log.json';

// === Get price info ===
async function getPriceInfo() {
  try {
    const pair = new web3.eth.Contract(IUniswapV2PairABI, pairAddress);
    const reserves = await pair.methods.getReserves().call();
    const token0 = await pair.methods.token0().call();
    const token1 = await pair.methods.token1().call();

    const [reserve0, reserve1] = [reserves._reserve0, reserves._reserve1];
    let tokenReserve, ethReserve;

    if (token0.toLowerCase() === tokenAddress) {
      tokenReserve = reserve0;
      ethReserve = reserve1;
    } else {
      tokenReserve = reserve1;
      ethReserve = reserve0;
    }

    const tokenReserveParsed = parseFloat(web3.utils.fromWei(tokenReserve));
    const ethReserveParsed = parseFloat(web3.utils.fromWei(ethReserve));

    if (tokenReserveParsed === 0 || ethReserveParsed === 0) {
      throw new Error("Reserves are zero – pair might not be active or has no liquidity.");
    }

    const priceInETH = ethReserveParsed / tokenReserveParsed;
    const ethPriceUSD = 2500; // Ganti ke API jika ingin dinamis
    const priceInUSD = priceInETH * ethPriceUSD;

    return {
      ethPrice: priceInETH.toFixed(8),
      usdPrice: priceInUSD.toFixed(6),
    };
  } catch (err) {
    console.error('getPriceInfo error:', err.message);
    return { ethPrice: '0', usdPrice: '0' };
  }
}

// === Log transaksi buy besar ===
async function logVolume(usdAmount) {
  const now = Date.now();
  let logs = [];

  if (fs.existsSync(volumeLogFile)) {
    logs = JSON.parse(fs.readFileSync(volumeLogFile));
  }

  logs.push({ timestamp: now, usd: usdAmount });
  fs.writeFileSync(volumeLogFile, JSON.stringify(logs, null, 2));
}

// === Get 24h volume ===
async function getDailyVolume() {
  try {
    const now = Date.now();
    let logs = [];

    if (fs.existsSync(volumeLogFile)) {
      logs = JSON.parse(fs.readFileSync(volumeLogFile));
    }

    logs = logs.filter((log) => now - log.timestamp <= 24 * 60 * 60 * 1000);
    const totalVolume = logs.reduce((sum, log) => sum + parseFloat(log.usd), 0);
    return totalVolume;
  } catch (err) {
    console.error('getDailyVolume error:', err.message);
    return 0;
  }
}

// === Pantau transaksi live di pair ===
function monitorPair(callback) {
  const pairContract = new web3.eth.Contract(IUniswapV2PairABI, pairAddress);

  pairContract.events.Swap({}, async (error, event) => {
    if (error) {
      console.error('Swap event error:', error.message);
      return;
    }

    try {
      const { amount0In, amount1In, amount0Out, amount1Out, sender, to } = event.returnValues;
      const buyAmount = amount0In === '0' ? amount1In : amount0In;

      const { usdPrice } = await getPriceInfo();
      const usdValue = parseFloat(web3.utils.fromWei(buyAmount)) * parseFloat(usdPrice);

      if (usdValue >= parseFloat(process.env.WHALE_THRESHOLD)) {
        await logVolume(usdValue);
        callback({
          buyer: sender,
          recipient: to,
          amount: buyAmount,
          usdValue,
        });
      }
    } catch (err) {
      console.error('monitorPair processing error:', err.message);
    }
  });
}

module.exports = {
  getPriceInfo,
  getDailyVolume,
  logVolume,
  monitorPair,
};
