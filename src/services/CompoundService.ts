import { type Address, formatUnits } from 'viem';
import { CompoundCometABI } from '../abis/CompoundComet';
import { publicClient } from '../config/viem';

interface CompoundReserveData {
  symbol: string;
  supplyAPY: number; // as percentage
}

// Compound v3 markets on Base
const COMPOUND_MARKETS = {
  USDC: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
  ETH: '0x46e6b214b524310239732D51387075E0e70970bf',
  USDBC: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
  AERO: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
} as const;

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

async function getMarketData(address: Address): Promise<CompoundReserveData> {
  // First get the current utilization
  const utilization = await publicClient.readContract({
    address,
    abi: CompoundCometABI,
    functionName: 'getUtilization',
  });

  // Use the utilization to get the supply rate
  const supplyRate = await publicClient.readContract({
    address,
    abi: CompoundCometABI,
    functionName: 'getSupplyRate',
    args: [utilization],
  });

  const symbol = await publicClient.readContract({
    address,
    abi: CompoundCometABI,
    functionName: 'symbol',
  });

  // Convert supply rate to APY
  // Supply APR = Supply Rate / (10^18) * Seconds Per Year * 100
  const supplyAPY =
    Number(formatUnits(supplyRate, 18)) * SECONDS_PER_YEAR * 100;

  return {
    symbol,
    supplyAPY,
  };
}

export async function getCompoundReservesAPY(): Promise<CompoundReserveData[]> {
  try {
    const marketAddresses = Object.values(COMPOUND_MARKETS);
    const marketData = await Promise.all(
      marketAddresses.map((address) => getMarketData(address)),
    );

    return marketData;
  } catch (error) {
    console.error('Error fetching Compound reserves:', error);
    throw new Error('Failed to fetch Compound reserves data');
  }
}
