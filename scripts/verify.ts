import { run } from "hardhat";

async function main() {
  const contractAddress = "0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD";

  const constructorArgs = [
    "0xad1eCa41E6F772bE3cb5A48A6141f9bcc1AF9F7c", // Abstract Mainnet Router
    "0x82802d0ADb6105819C2ce7904132A68efD326494"  // Dev fee wallet
  ];

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: constructorArgs,
  });

  console.log(`✅ Verification request submitted for ${contractAddress}`);
}

main().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
