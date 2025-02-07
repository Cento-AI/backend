import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
import { AaveV3Base } from '@bgd-labs/aave-address-book';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import type { UserReserveData } from '../types/lending-protocol';

const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);

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

export async function getUserReserves(
  userAddress: string,
): Promise<UserReserveData[]> {
  try {
    // Fetch both pool and user data
    const [{ reservesData, baseCurrencyData }, userData] = await Promise.all([
      poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: AaveV3Base.POOL_ADDRESSES_PROVIDER,
      }),
      poolDataProviderContract.getUserReservesHumanized({
        lendingPoolAddressProvider: AaveV3Base.POOL_ADDRESSES_PROVIDER,
        user: userAddress,
      }),
    ]);

    const currentTimestamp = dayjs().unix();

    // Format reserves and user summary using aave-math-utils
    const formattedPoolReserves = formatReserves({
      reserves: reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    const userSummary = formatUserSummary({
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      userReserves: userData.userReserves,
      userEmodeCategoryId: userData.userEmodeCategoryId,
      formattedReserves: formattedPoolReserves,
    });

    // Map to our simplified format
    return userSummary.userReservesData.map((reserve) => ({
      symbol: reserve.reserve.symbol,
      underlyingAsset: reserve.underlyingAsset,
      balance: reserve.underlyingBalance,
    }));
  } catch (error) {
    console.error('Error fetching user reserves:', error);
    throw new Error('Failed to fetch user reserves data');
  }
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
