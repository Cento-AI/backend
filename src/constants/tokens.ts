import type { Address } from 'viem';

// TODO: Add other supported tokens
export const SUPPORTED_TOKENS: Address[] = [
  '0x0000000000000000000000000000000000000000', // ETH
  '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
] as const;
