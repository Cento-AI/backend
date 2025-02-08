import {
  ActionProvider,
  type EvmWalletProvider,
  type Network,
  customActionProvider,
} from '@coinbase/agentkit';
import { encodeFunctionData } from 'viem';
import { VaultFactoryABI } from '../abis/VaultFactoryABI';
import { VAULT_FACTORY_ADDRESS } from '../constants/VaultFactoryAddress';
import {
  type CreateVaultSchema,
  createVaultSchema,
} from '../validators/VaultFactoryActionSchema';

const createVaultAction = customActionProvider<EvmWalletProvider>({
  name: 'create_vault',
  description: 'Create a new vault for a user',
  schema: createVaultSchema,
  invoke: async (walletProvider, args: CreateVaultSchema) => {
    try {
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

      // You might want to parse the event to get the vault address
      return `Successfully created vault for ${args.owner} (tx: ${receipt.transactionHash})`;
    } catch (error) {
      return `Error creating vault for ${args.owner}: ${error}`;
    }
  },
});

class VaultFactoryActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() {
    super('vault-factory-action-provider', [createVaultAction]);
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultFactoryActionProvider = () =>
  new VaultFactoryActionProvider();
