import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
  ViemWalletProvider,
} from '@coinbase/agentkit';
import { encodeFunctionData } from 'viem';
import { VaultFactoryABI } from '../abis/VaultFactoryABI';
import { VAULT_FACTORY_ADDRESS } from '../constants/VaultFactoryAddress';
import { WalletService } from '../services/WalletService';
import {
  type CreateVaultSchema,
  createVaultSchema,
} from '../validators/VaultFactoryActionSchema';

class VaultFactoryActionProvider extends ActionProvider<EvmWalletProvider> {
  private walletProvider: EvmWalletProvider;
  constructor() {
    super('vault-factory-action-provider', []);
    this.walletProvider = new ViemWalletProvider(
      WalletService.getInstance().getWalletClient(),
    );
  }

  @CreateAction({
    name: 'create_vault',
    description: 'Create a new vault for a user',
    schema: createVaultSchema,
  })
  async createVault(args: CreateVaultSchema): Promise<string> {
    try {
      const data = encodeFunctionData({
        abi: VaultFactoryABI,
        functionName: 'createVault',
        args: [args.owner],
      });

      const hash = await this.walletProvider.sendTransaction({
        to: VAULT_FACTORY_ADDRESS,
        data,
      });

      const receipt = await this.walletProvider.waitForTransactionReceipt(hash);

      return `Successfully created vault for ${args.owner} (tx: ${receipt.transactionHash})`;
    } catch (error) {
      console.error('Error in createVault action:', error);
      throw error;
    }
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultFactoryActionProvider = () =>
  new VaultFactoryActionProvider();
