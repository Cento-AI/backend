import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import { encodeFunctionData } from 'viem';
import { VaultFactoryABI } from '../abis/VaultFactoryABI';
import { VAULT_FACTORY_ADDRESS } from '../constants/VaultFactoryAddress';
import {
  type CreateVaultSchema,
  createVaultSchema,
} from '../validators/VaultFactoryActionSchema';

class VaultFactoryActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() {
    super('vault-factory-action-provider', []);
  }

  @CreateAction({
    name: 'create_vault',
    description: 'Create a new vault for a user',
    schema: createVaultSchema,
  })
  async createVault(
    walletProvider: EvmWalletProvider,
    args: CreateVaultSchema,
  ): Promise<string> {
    const data = encodeFunctionData({
      abi: VaultFactoryABI,
      functionName: 'createVault',
      args: [args.owner],
    });

    const hash = await walletProvider.sendTransaction({
      to: VAULT_FACTORY_ADDRESS,
      data,
    });

    const receipt = await walletProvider.waitForTransactionReceipt(hash);

    return `Successfully created vault for ${args.owner} (tx: ${receipt.transactionHash})`;
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultFactoryActionProvider = () =>
  new VaultFactoryActionProvider();
