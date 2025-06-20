import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

async function main(hre: HardhatRuntimeEnvironment) {
  console.log("🚀 Deploying TRGStaking to Abstract Mainnet...");

  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact("TRGStaking");
  const trgTokenAddress = "0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD";

  const staking = await deployer.deploy(artifact, [trgTokenAddress]);

  const address = await staking.getAddress();
  console.log(`✅ TRGStaking deployed at: ${address}`);
}

// ⬇️ Add this line to actually run the main function
main(require("hardhat"));
