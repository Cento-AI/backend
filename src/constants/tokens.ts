import type { Address } from 'viem';

// TODO: Add other supported tokens
export const SUPPORTED_TOKENS: Address[] = [
  '0x0000000000000000000000000000000000000000', // ETH
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
] as const;
