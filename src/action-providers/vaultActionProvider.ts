import {
  ActionProvider,
  type EvmWalletProvider,
  type Network,
  customActionProvider,
} from '@coinbase/agentkit';
import { encodeFunctionData } from 'viem';
import { VaultABI } from '../abis/VaultABI';
import {
  type AddLiquiditySchema,
  type LendTokenSchema,
  type RemoveLiquiditySchema,
  type WithdrawLentTokenSchema,
  addLiquiditySchema,
  lendTokenSchema,
  removeLiquiditySchema,
  withdrawLentTokenSchema,
} from '../validators/VaultActionSchema';

const lendTokenAction = customActionProvider<EvmWalletProvider>({
  name: 'lend_tokens',
  description: 'Lend tokens through the vault to a lending protocol',
  schema: lendTokenSchema,
  invoke: async (walletProvider, args: LendTokenSchema) => {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'lendTokens',
        args: [args.protocol, args.token, args.amount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully lent ${args.amount} ${args.token} to ${args.protocol} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error lending ${args.amount} ${args.token} to ${args.protocol} on ${args.vaultAddress}: ${error}`;
    }
  },
});

const withdrawLentAction = customActionProvider<EvmWalletProvider>({
  name: 'withdraw_lent',
  description: 'Withdraw lent tokens from a lending protocol through the vault',
  schema: withdrawLentTokenSchema,
  invoke: async (walletProvider, args: WithdrawLentTokenSchema) => {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'withdrawLentTokens',
        args: [args.protocol, args.token, args.amount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully withdrew ${args.amount} ${args.token} from ${args.protocol} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error withdrawing ${args.amount} ${args.token} from ${args.protocol} on ${args.vaultAddress}: ${error}`;
    }
  },
});

const addLiquidityAction = customActionProvider<EvmWalletProvider>({
  name: 'add_liquidity',
  description: 'Add liquidity to a pool through the vault',
  schema: addLiquiditySchema,
  invoke: async (walletProvider, args: AddLiquiditySchema) => {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'addLiquidity',
        args: [
          args.protocol,
          args.token0,
          args.token1,
          args.amount0,
          args.amount1,
        ],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully added liquidity: ${args.amount0} ${args.token0} and ${args.amount1} ${args.token1} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error adding liquidity for ${args.token0}/${args.token1} on ${args.vaultAddress}: ${error}`;
    }
  },
});

export const removeLiquidityAction = customActionProvider<EvmWalletProvider>({
  name: 'remove_liquidity',
  description: 'Remove liquidity from a pool through the vault',
  schema: removeLiquiditySchema,
  invoke: async (walletProvider, args: RemoveLiquiditySchema) => {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'removeLiquidity',
        args: [args.protocol, args.token0, args.token1, args.lpAmount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully removed ${args.lpAmount} LP tokens for ${args.token0}/${args.token1} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error removing liquidity for ${args.token0}/${args.token1} on ${args.vaultAddress}: ${error}`;
    }
  },
});

export const vaultActionsProvider = [
  lendTokenAction,
  withdrawLentAction,
  addLiquidityAction,
  removeLiquidityAction,
];

class VaultActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() {
    super('vault-action-provider', [
      lendTokenAction,
      withdrawLentAction,
      addLiquidityAction,
      removeLiquidityAction,
    ]);
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultActionProvider = () => new VaultActionProvider();
