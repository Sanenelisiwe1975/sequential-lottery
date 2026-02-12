// Hardhat deployment script for TieredSequentialLotteryVRF
// Save as: scripts/deploy-lottery-vrf.js

const hre = require("hardhat");

async function main() {
  console.log("🎰 Deploying Tiered Sequential Lottery with Chainlink VRF...\n");

  // Network configurations
  const VRF_CONFIGS = {
    sepolia: {
      name: "Sepolia Testnet",
      vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
      gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
      callbackGasLimit: "2500000",
      // UPDATE THIS with your subscription ID
      subscriptionId: process.env.VRF_SUBSCRIPTION_ID || "0"
    },
    mumbai: {
      name: "Polygon Mumbai Testnet",
      vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
      gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
      callbackGasLimit: "2500000",
      subscriptionId: process.env.VRF_SUBSCRIPTION_ID || "0"
    },
    mainnet: {
      name: "Ethereum Mainnet",
      vrfCoordinator: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
      gasLane: "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
      callbackGasLimit: "2500000",
      subscriptionId: process.env.VRF_SUBSCRIPTION_ID || "0"
    },
    polygon: {
      name: "Polygon Mainnet",
      vrfCoordinator: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
      gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93",
      callbackGasLimit: "2500000",
      subscriptionId: process.env.VRF_SUBSCRIPTION_ID || "0"
    }
  };

  // Get current network
  const networkName = hre.network.name;
  const config = VRF_CONFIGS[networkName];

  if (!config) {
    console.error(`❌ Network ${networkName} not configured!`);
    console.log("Supported networks:", Object.keys(VRF_CONFIGS).join(", "));
    process.exit(1);
  }

  // Validate subscription ID
  if (config.subscriptionId === "0") {
    console.error("❌ ERROR: VRF_SUBSCRIPTION_ID not set!");
    console.log("\nPlease set your Chainlink VRF subscription ID:");
    console.log("export VRF_SUBSCRIPTION_ID=your_subscription_id");
    console.log("\nOr update the script directly with your subscription ID.");
    process.exit(1);
  }

  console.log("Network:", config.name);
  console.log("VRF Coordinator:", config.vrfCoordinator);
  console.log("Gas Lane:", config.gasLane);
  console.log("Subscription ID:", config.subscriptionId);
  console.log("Callback Gas Limit:", config.callbackGasLimit);
  console.log("");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy contract
  console.log("Deploying contract...");
  const LotteryVRF = await hre.ethers.getContractFactory("TieredSequentialLotteryVRF");
  
  const lottery = await LotteryVRF.deploy(
    config.vrfCoordinator,
    config.gasLane,
    config.subscriptionId,
    config.callbackGasLimit
  );

  await lottery.waitForDeployment();
  const contractAddress = await lottery.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("");

  // Display important next steps
  console.log("=" .repeat(70));
  console.log("🎯 IMPORTANT NEXT STEPS:");
  console.log("=" .repeat(70));
  console.log("");
  console.log("1. Add this contract as a consumer to your VRF subscription:");
  console.log("   👉 Visit: https://vrf.chain.link");
  console.log("   👉 Select your subscription");
  console.log("   👉 Click 'Add Consumer'");
  console.log("   👉 Paste contract address:", contractAddress);
  console.log("");
  console.log("2. Verify contract on block explorer:");
  if (networkName === "sepolia") {
    console.log("   npx hardhat verify --network sepolia", contractAddress, 
      config.vrfCoordinator, config.gasLane, config.subscriptionId, config.callbackGasLimit);
  } else if (networkName === "mumbai") {
    console.log("   npx hardhat verify --network mumbai", contractAddress,
      config.vrfCoordinator, config.gasLane, config.subscriptionId, config.callbackGasLimit);
  }
  console.log("");
  console.log("3. Update frontend with contract address:");
  console.log("   File: src/constants/index.ts");
  console.log("   LOTTERY_CONTRACT_ADDRESS =", `"${contractAddress}"`);
  console.log("");
  console.log("4. Start the first round:");
  console.log("   await contract.startNewRound(86400); // 24 hours");
  console.log("");
  console.log("=" .repeat(70));
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: config.name,
    contractAddress: contractAddress,
    vrfCoordinator: config.vrfCoordinator,
    gasLane: config.gasLane,
    subscriptionId: config.subscriptionId,
    callbackGasLimit: config.callbackGasLimit,
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
