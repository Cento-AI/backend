export interface PortfolioStrategy {
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  allocations: {
    lending: number; // percentage
    liquidity: number; // percentage
  };
  preferences: {
    stablecoinsOnly: boolean;
    preferredAssets: string[];
    minimumAPY?: number;
  };
}
