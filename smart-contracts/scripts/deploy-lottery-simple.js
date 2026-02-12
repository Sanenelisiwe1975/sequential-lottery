
const hre = require("hardhat");

async function main() {
  console.log("🎰 Deploying Tiered Sequential Lottery (Non-VRF Version)...\n");

  const networkName = hre.network.name;
  console.log("Network:", networkName);
  console.log("");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy contract
  console.log("Deploying contract...");
  const Lottery = await hre.ethers.getContractFactory("TieredSequentialLottery");
  
  const lottery = await Lottery.deploy();

  await lottery.waitForDeployment();
  const contractAddress = await lottery.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("");

  // Display important next steps
  console.log("=".repeat(70));
  console.log("🎯 NEXT STEPS:");
  console.log("=".repeat(70));
  console.log("");
  console.log("1. Update frontend with contract address:");
  console.log("   File: src/constants/index.ts");
  console.log("   LOTTERY_CONTRACT_ADDRESS =", `"${contractAddress}"`);
  console.log("");
  console.log("2. Start the first round:");
  console.log("   await contract.startNewRound(86400); // 24 hours");
  console.log("");
  console.log("=".repeat(70));
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    contractAddress: contractAddress,
    contractType: "TieredSequentialLottery (Non-VRF)",
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  console.log("📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  // Optionally save to file
  const fs = require('fs');
  const deploymentFile = `deployments/${networkName}-${Date.now()}.json`;
  
  try {
    if (!fs.existsSync('deployments')) {
      fs.mkdirSync('deployments');
    }
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentFile);
  } catch (error) {
    console.log("ℹ️  Could not save deployment file:", error.message);
  }

  console.log("");
  console.log("🎉 Deployment complete!");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
