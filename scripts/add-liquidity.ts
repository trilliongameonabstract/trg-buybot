import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import IERC20Abi from "../interfaces/IERC20.json";
import IRouterAbi from "../interfaces/IUniswapV2Router02.json";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenAddress = "0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD"; // TRG
  const routerAddress = "0xad1eCa41E6F772bE3cb5A48A6141f9bcc1AF9F7c"; // Abstract Mainnet Router V2

  const token = new ethers.Contract(tokenAddress, IERC20Abi, deployer);
  const router = new ethers.Contract(routerAddress, IRouterAbi, deployer);

  const amountTokenDesired = ethers.utils.parseUnits("100000000", 18); // 100M TRG
  const amountETH = ethers.utils.parseEther("0.5");

  await token.approve(routerAddress, amountTokenDesired);
  console.log("✅ Token approved");

  const tx = await router.addLiquidityETH(
    tokenAddress,
    amountTokenDesired,
    0,
    0,
    deployer.address,
    Math.floor(Date.now() / 1000) + 1800,
    { value: amountETH }
  );

  await tx.wait();
  console.log("🚀 Liquidity added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
