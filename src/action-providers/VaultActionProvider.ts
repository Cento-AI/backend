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
  type SwapTokenSchema,
  type WithdrawLentTokenSchema,
  addLiquiditySchema,
  lendTokenSchema,
  removeLiquiditySchema,
  swapTokenSchema,
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
        args: [args.provider, args.token, args.amount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully lent ${args.amount} ${args.token} to ${args.provider} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error lending ${args.amount} ${args.token} to ${args.provider} on ${args.vaultAddress}: ${error}`;
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
        args: [args.provider, args.token, args.amount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully withdrew ${args.amount} ${args.token} from ${args.provider} on ${args.vaultAddress}`;
    } catch (error) {
      return `Error withdrawing ${args.amount} ${args.token} from ${args.provider} on ${args.vaultAddress}: ${error}`;
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
          args.provider,
          args.token0,
          args.token1,
          args.amount0,
          args.amount1,
          args.fee,
          args.tickLower,
          args.tickUpper,
        ],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully added liquidity: ${args.amount0} ${args.token0} and ${args.amount1} ${args.token1} on ${args.provider}`;
    } catch (error) {
      return `Error adding liquidity for ${args.token0}/${args.token1} on ${args.provider}: ${error}`;
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
        args: [args.provider, args.token0, args.token1, args.liquidityAmount],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully removed ${args.liquidityAmount} LP tokens for ${args.token0}/${args.token1} on ${args.provider}`;
    } catch (error) {
      return `Error removing liquidity for ${args.token0}/${args.token1} on ${args.provider}: ${error}`;
    }
  },
});

const swapTokenAction = customActionProvider<EvmWalletProvider>({
  name: 'swap_tokens',
  description: 'Swap tokens through Uniswap via the vault',
  schema: swapTokenSchema,
  invoke: async (walletProvider, args: SwapTokenSchema) => {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'swapOnUniswap',
        args: [args.tokenIn, args.tokenOut, args.amountIn, args.fee],
      });

      const hash = await walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully swapped ${args.amountIn} ${args.tokenIn} for ${args.tokenOut}`;
    } catch (error) {
      return `Error swapping ${args.tokenIn} for ${args.tokenOut}: ${error}`;
    }
  },
});

export const vaultActionsProvider = [
  lendTokenAction,
  withdrawLentAction,
  addLiquidityAction,
  removeLiquidityAction,
  swapTokenAction,
];

class VaultActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() {
    super('vault-action-provider', [
      lendTokenAction,
      withdrawLentAction,
      addLiquidityAction,
      removeLiquidityAction,
      swapTokenAction,
    ]);
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultActionProvider = () => new VaultActionProvider();
