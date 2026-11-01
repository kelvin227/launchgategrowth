// Hardcoded on purpose. Do not load these from a CMS, database or any
// source that can be edited without a code review and a deploy.

export type Wallet = {
  id: string;
  network: string;
  standard?: string;
  address: string;
  explorerName: string;
  explorerUrl: string;
};

const EVM_ADDRESS = "0xb2dA4545238aEB3fc70F21BBd8DeA89a5b6a5c60";

export const TREASURY_WALLETS: Wallet[] = [
  {
    id: "btc",
    network: "Bitcoin",
    standard: "BTC",
    address: "bc1q46dh563u9dltjkuyum5nmnt0pcr8tf4u8jgksy",
    explorerName: "Blockchain Explorer",
    explorerUrl:
      "https://www.blockchain.com/explorer/addresses/btc/bc1q46dh563u9dltjkuyum5nmnt0pcr8tf4u8jgksy",
  },
  {
    id: "bsc",
    network: "BNB Smart Chain",
    standard: "BEP-20",
    address: EVM_ADDRESS,
    explorerName: "BscScan",
    explorerUrl: `https://bscscan.com/address/${EVM_ADDRESS}`,
  },
  {
    id: "eth",
    network: "Ethereum",
    standard: "ERC-20",
    address: EVM_ADDRESS,
    explorerName: "Etherscan",
    explorerUrl: `https://etherscan.io/address/${EVM_ADDRESS}`,
  },
  {
    id: "base",
    network: "Base",
    address: EVM_ADDRESS,
    explorerName: "BaseScan",
    explorerUrl: `https://basescan.org/address/${EVM_ADDRESS}`,
  },
  {
    id: "sol",
    network: "Solana",
    standard: "SOL",
    address: "9qYMsqpg4fYgm281zGgJredaAxZEuxEWMS6wHhVH4X6w",
    explorerName: "Solscan",
    explorerUrl:
      "https://solscan.io/account/9qYMsqpg4fYgm281zGgJredaAxZEuxEWMS6wHhVH4X6w",
  },
];

export const DISTRIBUTION_WALLET: Wallet = {
  id: "bsc-rewards",
  network: "BNB Smart Chain",
  standard: "BEP-20",
  address: "0xC6b2edf8e57B57D274D219C49264a5d36A2eA31b",
  explorerName: "BscScan",
  explorerUrl:
    "https://bscscan.com/address/0xC6b2edf8e57B57D274D219C49264a5d36A2eA31b",
};
