import type { StrategyAction } from './strategy-action';

export interface PortfolioRebalance {
  currentPortfolio: {
    totalValue: string;
    assets: Array<{
      symbol: string;
      balance: string;
      value: string;
    }>;
  };
  suggestedActions: StrategyAction[];
}
