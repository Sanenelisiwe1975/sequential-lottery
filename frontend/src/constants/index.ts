// Contract address - UPDATE THIS after deploying your contract
export const LOTTERY_CONTRACT_ADDRESS = "0x7C32805f98c8897C42BB52C57186Fd08Cd2Ec304"; // Chainlink VRF version deployed

// Chain configuration
export const SUPPORTED_CHAINS = {
  SEPOLIA: 11155111,
  MUMBAI: 80001,
  LOCALHOST: 31337,
};

// Update this to match your deployment network
export const ACTIVE_CHAIN = SUPPORTED_CHAINS.SEPOLIA;
