export interface StrategyAction {
  asset: string;
  currentAmount: string;
  targetAmount: string;
  action:
    | 'lend_tokens'
    | 'withdraw_lent'
    | 'add_liquidity'
    | 'remove_liquidity';
  protocol: 'aave' | 'compound' | 'uniswap' | 'aerodrome';
}
