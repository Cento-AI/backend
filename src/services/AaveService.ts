import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers';
import { formatReserves } from '@aave/math-utils';
import { AaveV3Base } from '@bgd-labs/aave-address-book';
import dayjs from 'dayjs';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.base.org',
);

const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress: AaveV3Base.UI_POOL_DATA_PROVIDER,
  provider,
  chainId: ChainId.base,
});

// const incentiveDataProviderContract = new UiIncentiveDataProvider({
//   uiIncentiveDataProviderAddress: AaveV3Base.UI_INCENTIVE_DATA_PROVIDER,
//   provider,
//   chainId: ChainId.base,
// });

interface ReserveData {
  symbol: string;
  supplyAPY: number; // as percentage
}

export async function getReservesAPY(): Promise<ReserveData[]> {
  try {
    // Fetch pool reserves data
    const { reservesData, baseCurrencyData } =
      await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: AaveV3Base.POOL_ADDRESSES_PROVIDER,
      });

    const currentTimestamp = dayjs().unix();

    const formattedReserves = formatReserves({
      reserves: reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    return formattedReserves.map((reserve) => ({
      symbol: reserve.symbol,
      supplyAPY: Number(reserve.supplyAPY) * 100, // Convert to percentage
    }));
  } catch (error) {
    console.error('Error fetching AAVE reserves:', error);
    throw new Error('Failed to fetch AAVE reserves data');
  }
}
