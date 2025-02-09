import { type Address, getContract } from 'viem';
import { VaultFactoryABI } from '../abis/VaultFactoryABI';
import { publicClient } from '../config/viem';
import { VAULT_FACTORY_ADDRESS } from '../constants/VaultFactoryAddress';

export class VaultFactoryService {
  private static instance: VaultFactoryService;
  private contract;

  private constructor() {
    this.contract = getContract({
      address: VAULT_FACTORY_ADDRESS,
      abi: VaultFactoryABI,
      client: publicClient,
    });
  }

  public static getInstance(): VaultFactoryService {
    if (!VaultFactoryService.instance) {
      VaultFactoryService.instance = new VaultFactoryService();
    }
    return VaultFactoryService.instance;
  }

  public async getVaultAddress(
    ownerAddress: Address,
  ): Promise<Address | undefined> {
    try {
      const vaultAddress = await this.contract.read.ownerToVaultAddress([
        ownerAddress,
      ]);

      if (vaultAddress === '0x0000000000000000000000000000000000000000') {
        return undefined;
      }

      return vaultAddress;
    } catch (error) {
      console.error('Error getting vault address:', error);
      throw new Error('Failed to get vault address');
    }
  }
}
