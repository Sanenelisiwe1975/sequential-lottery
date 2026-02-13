'use client';

import { createConfig, http } from 'wagmi';
import { sepolia, polygonMumbai } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Simple config - uses your injected wallet (MetaMask, etc)
export const config = createConfig({
  chains: [sepolia, polygonMumbai],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/tpgeP44Sjq7RpnQOE1WwL'),
    [polygonMumbai.id]: http('https://polygon-mumbai.g.alchemy.com/v2/tpgeP44Sjq7RpnQOE1WwL'),
  },
});
