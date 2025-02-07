import type { Address } from 'viem';

export interface ReserveRate {
  symbol: string;
  supplyAPY: number; // as percentage
}

export interface ProtocolRates {
  protocol: 'aave' | 'compound';
  reserves: ReserveRate[];
}

export interface UserReserveData {
  symbol: string;
  underlyingAsset: Address;
  balance: string;
}
