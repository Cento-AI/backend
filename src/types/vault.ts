import type { Address } from 'viem';
import type { PortfolioStrategy } from './portfolio-strategy';

export interface UserVaultData {
  vaultAddress: Address;
  strategy?: PortfolioStrategy;
  status: 'created' | 'funded' | 'active';
  createdAt: Date;
  lastUpdated: Date;
}

export interface VaultBalance {
  token: Address;
  balance: bigint;
}
