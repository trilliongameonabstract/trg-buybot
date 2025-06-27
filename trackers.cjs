require('dotenv').config();
const Web3 = require('web3');
const IERC20ABI = require('./interfaces/IERC20.json');
const IUniswapV2PairABI = require('./interfaces/IUniswapV2Pair.json');
const fs = require('fs');

const web3 = new Web3(process.env.RPC_URL); // WSS endpoint!
const tokenAddress = process.env.TOKEN_ADDRESS.toLowerCase();
const pairAddress = process.env.PAIR_ADDRESS.toLowerCase();
const volumeLogFile = 'volume-log.json';
const whaleThreshold = parseFloat(process.env.WHALE_THRESHOLD || '100000');

// ========== PRICE INFO ==========
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

    const priceInETH = parseFloat(web3.utils.fromWei(ethReserve)) / parseFloat(web3.utils.fromWei(tokenReserve));
    const ethPriceUSD = 3500; // Optional: replace with dynamic ETH/USD fetch
    const priceInUSD = priceInETH * ethPriceUSD;

    return {
      ethPrice: priceInETH.toFixed(8),
      usdPrice: priceInUSD.toFixed(6),
    };
  } catch (err) {
    console.error('getPriceInfo error:', err);
    return { ethPrice: '0', usdPrice: '0' };
  }
}

// ========== VOLUME TRACKING ==========
function getDailyVolume() {
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
    console.error('getDailyVolume error:', err);
    return 0;
  }
}

function logVolume(usdAmount) {
  const now = Date.now();
  let logs = [];

  if (fs.existsSync(volumeLogFile)) {
    logs = JSON.parse(fs.readFileSync(volumeLogFile));
  }

  logs.push({ timestamp: now, usd: usdAmount });
  fs.writeFileSync(volumeLogFile, JSON.stringify(logs, null, 2));
}

// ========== TRANSACTION MONITORING ==========
function monitorPair(callback) {
  const pairContract = new web3.eth.Contract(IUniswapV2PairABI, pairAddress);

  console.log('🔍 Listening to real pair on-chain...');

  pairContract.events.Swap({}, async (error, event) => {
    if (error) {
      console.error('Swap event error:', error);
      return;
    }

    const { returnValues, transactionHash } = event;
    const { amount0In, amount1In, amount0Out, amount1Out, sender, to } = returnValues;

    const token0 = await pairContract.methods.token0().call();
    const token1 = await pairContract.methods.token1().call();

    let amountToken;
    if (token0.toLowerCase() === tokenAddress) {
      amountToken = amount0In !== '0' ? amount0In : amount0Out;
    } else {
      amountToken = amount1In !== '0' ? amount1In : amount1Out;
    }

    const amountFormatted = parseFloat(web3.utils.fromWei(amountToken));
    const { usdPrice } = await getPriceInfo();
    const usdAmount = amountFormatted * parseFloat(usdPrice);

    logVolume(usdAmount);

    // Build data object
    const buyData = {
      tx: transactionHash,
      buyer: sender,
      amount: amountFormatted,
      usd: usdAmount.toFixed(2),
      whale: usdAmount >= whaleThreshold,
    };

    callback(buyData);
  });
}

module.exports = {
  getPriceInfo,
  getDailyVolume,
  logVolume,
  monitorPair,
};
