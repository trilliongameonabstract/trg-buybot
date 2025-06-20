import { run } from "hardhat";

async function main() {
  const stakingAddress  = "0xF2361859517CbACbBC39180036496d37bff88BFC";
  const constructorArgs = ["0xE50716A1d4D91aa03e2b490c992B2628bDAbbADD"];
  await run("verify:verify", {
    address: stakingAddress,
    constructorArguments: constructorArgs,
  });
  console.log("✅ TRGStaking verified!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
