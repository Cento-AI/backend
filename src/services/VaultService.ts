import { type Address, getContract } from 'viem';
import { VaultABI } from '../abis/VaultABI';
import { publicClient } from '../config/viem';

interface VaultAssetBalance {
  asset: Address;
  balance: bigint;
  investedInAave: bigint;
  investedInCompound: bigint;
  investedInUniswap: bigint;
}

export class VaultService {
  private static instance: VaultService;

  private constructor() {}

  public static getInstance(): VaultService {
    if (!VaultService.instance) {
      VaultService.instance = new VaultService();
    }
    return VaultService.instance;
  }

  public async getAssetBalance(
    vaultAddress: Address,
    tokenAddress: Address,
  ): Promise<VaultAssetBalance> {
    try {
      const contract = getContract({
        address: vaultAddress,
        abi: VaultABI,
        client: publicClient,
      });

      const balance = await contract.read.getUserStruct([tokenAddress]);

      return {
        asset: balance.asset,
        balance: balance.balance,
        investedInAave: balance.investedInAave,
        investedInCompound: balance.investedInCompound,
        investedInUniswap: balance.investedInUniswap,
      };
    } catch (error) {
      console.error('Error getting vault balance:', error);
      throw new Error('Failed to get vault balance');
    }
  }

  public async getMultipleAssetBalances(
    vaultAddress: Address,
    tokenAddresses: Address[],
  ): Promise<VaultAssetBalance[]> {
    try {
      const balances = await Promise.all(
        tokenAddresses.map((token) =>
          this.getAssetBalance(vaultAddress, token),
        ),
      );
      return balances;
    } catch (error) {
      console.error('Error getting multiple vault balances:', error);
      throw new Error('Failed to get vault balances');
    }
  }
}
