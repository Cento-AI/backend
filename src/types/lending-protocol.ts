export interface ReserveRate {
  symbol: string;
  supplyAPY: number; // as percentage
}

export interface ProtocolRates {
  protocol: 'aave' | 'compound';
  reserves: ReserveRate[];
}
