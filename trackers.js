import dotenv from 'dotenv';
dotenv.config();
import Web3 from 'web3';
import IERC20ABI from './interfaces/IERC20.json' assert { type: 'json' };
import IUniswapV2PairABI from './interfaces/IUniswapV2Pair.json' assert { type: 'json' };
import fs from 'fs';

const web3 = new Web3(process.env.RPC_URL);
const pairAddress = process.env.PAIR_ADDRESS.toLowerCase();
const tokenAddress = process.env.TOKEN_ADDRESS.toLowerCase();
const ethDecimals = 18;
const tokenDecimals = 18;

const volumeLogFile = 'volume-log.json';

// Get token price from UniswapV2 pair reserves
export async function getPriceInfo() {
  try {
    const pairContract = new web3.eth.Contract(IUniswapV2PairABI, pairAddress);
    const reserves = await pairContract.methods.getReserves().call();
    const token0 = await pairContract.methods.token0().call();
    const token1 = await pairContract.methods.token1().call();

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
    const ethPriceUSD = 3500; // Replace with live ETH price API if needed
    const priceInUSD = priceInETH * ethPriceUSD;

    return {
      ethPrice: priceInETH.toFixed(8),
      usdPrice: priceInUSD.toFixed(6),
    };
  } catch (error) {
    console.error('getPriceInfo error:', error);
    return { ethPrice: '0', usdPrice: '0' };
  }
}

// Track and return total buy volume in last 24 hours (dummy file method)
export async function getDailyVolume() {
  try {
    const now = Date.now();
    let logs = [];

    if (fs.existsSync(volumeLogFile)) {
      const raw = fs.readFileSync(volumeLogFile);
      logs = JSON.parse(raw);
    }

    // Filter only last 24h logs
    logs = logs.filter((log) => now - log.timestamp <= 24 * 60 * 60 * 1000);

    const totalVolume = logs.reduce((sum, log) => sum + parseFloat(log.usd), 0);
    return totalVolume;
  } catch (err) {
    console.error('getDailyVolume error:', err);
    return 0;
  }
}

// Helper to log new buy volume into local file 
export async function logVolume(usdAmount) {
  const now = Date.now();
  let logs = [];

  if (fs.existsSync(volumeLogFile)) {
    logs = JSON.parse(fs.readFileSync(volumeLogFile));
  }

  logs.push({ timestamp: now, usd: usdAmount });
  fs.writeFileSync(volumeLogFile, JSON.stringify(logs, null, 2));
}
