// Contract address - UPDATE THIS after deploying your contract
export const LOTTERY_CONTRACT_ADDRESS = "0x1CF2C6caE9FC48656e0F22bE801094C14B28BA39"; // Chainlink VRF version with 3-minute rounds

// Chain configuration
export const SUPPORTED_CHAINS = {
  SEPOLIA: 11155111,
  MUMBAI: 80001,
  LOCALHOST: 31337,
};

// Update this to match your deployment network
export const ACTIVE_CHAIN = SUPPORTED_CHAINS.SEPOLIA;
