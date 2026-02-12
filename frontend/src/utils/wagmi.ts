'use client';

import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { sepolia, polygonMumbai } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Custom localhost chain config  
const localhost = {
  id: 31337,
  name: 'Hardhat Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

// For development with Hardhat: use injected providers only
// ProjectId is optional for local testing
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1';

export const config = getDefaultConfig({
  appName: 'Sequential Lottery DApp',
  projectId: walletConnectProjectId,
  chains: [localhost, sepolia, polygonMumbai],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
