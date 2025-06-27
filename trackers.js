import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import fs from 'fs';
import IERC20ABI from './interfaces/IERC20.json';
import IUniswapV2PairABI from './interfaces/IUniswapV2Pair.json';

const web3 = new Web3(process.env.RPC_URL);
const pairAddress = process.env.PAIR_ADDRESS.toLowerCase();
const tokenAddress = process.env.TOKEN_ADDRESS.toLowerCase();
const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || '18');
const volumeLogFile = 'volume-log.json';

// Get token price from reserves
export async function getPriceInfo() {
  try {
    const pair = new web3.eth.Contract(IUniswapV2PairABI, pairAddress);
    const reserves = await pair.methods.getReserves().call();
    const token0 = await pair.methods.token0().call();
    const [reserve0, reserve1] = [reserves._reserve0, reserves._reserve1];

    let tokenReserve, ethReserve;
    if (token0.toLowerCase() === tokenAddress) {
      tokenReserve = reserve0;
      ethReserve = reserve1;
    } else {
      tokenReserve = reserve1;
      ethReserve = reserve0;
    }

    const tokenAmount = parseFloat(web3.utils.fromWei(tokenReserve));
    const ethAmount = parseFloat(web3.utils.fromWei(ethReserve));

    const priceInETH = ethAmount / tokenAmount;
    const ethPriceUSD = 3500; // Hardcoded for now
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

// Get total volume in last 24h from local log file
export async function getDailyVolume() {
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

// Save new volume
export async function logVolume(usdAmount) {
  const now = Date.now();
  let logs = [];

  if (fs.existsSync(volumeLogFile)) {
    logs = JSON.parse(fs.readFileSync(volumeLogFile));
  }

  logs.push({ timestamp: now, usd: usdAmount });
  fs.writeFileSync(volumeLogFile, JSON.stringify(logs, null, 2));
}
