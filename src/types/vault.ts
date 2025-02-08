import type { PortfolioStrategy } from './portfolio-strategy';

export interface UserVaultData {
  vaultAddress: string;
  strategy?: PortfolioStrategy;
  status: 'created' | 'funded' | 'active';
  createdAt: Date;
  lastUpdated: Date;
}

export interface VaultBalance {
  token: string;
  balance: bigint;
}
