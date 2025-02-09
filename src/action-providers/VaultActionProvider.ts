import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import { ViemWalletProvider } from '@coinbase/agentkit';
import { encodeFunctionData } from 'viem';
import { VaultABI } from '../abis/VaultABI';
import { WalletService } from '../services/WalletService';
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

class VaultActionProvider extends ActionProvider<EvmWalletProvider> {
  private walletProvider: EvmWalletProvider;

  constructor() {
    super('vault-action-provider', []);
    // FIXME: This is a temporary solution to get the wallet provider
    // FIXME: We should use the wallet provider from the agentkit
    this.walletProvider = new ViemWalletProvider(
      WalletService.getInstance().getWalletClient(),
    );
  }

  @CreateAction({
    name: 'lend_tokens',
    description: 'Lend tokens through the vault to a lending protocol',
    schema: lendTokenSchema,
  })
  async lendTokens(args: LendTokenSchema): Promise<string> {
    try {
      const data = encodeFunctionData({
        abi: VaultABI,
        functionName: 'lendTokens',
        args: [args.provider, args.token, BigInt(args.amount)],
      });

      const hash = await this.walletProvider.sendTransaction({
        to: args.vaultAddress,
        data,
      });

      const receipt = await this.walletProvider.waitForTransactionReceipt(hash);

      return `Successfully lent ${args.amount} ${args.token} to ${args.provider}`;
    } catch (error) {
      console.error('Error in lendTokens:', error);
      throw error;
    }
  }

  @CreateAction({
    name: 'withdraw_lent',
    description:
      'Withdraw lent tokens from a lending protocol through the vault',
    schema: withdrawLentTokenSchema,
  })
  async withdrawLent(args: WithdrawLentTokenSchema): Promise<string> {
    const data = encodeFunctionData({
      abi: VaultABI,
      functionName: 'withdrawLentTokens',
      args: [args.provider, args.token, BigInt(args.amount)],
    });

    const hash = await this.walletProvider.sendTransaction({
      to: args.vaultAddress,
      data,
    });

    await this.walletProvider.waitForTransactionReceipt(hash);

    return `Successfully withdrew ${args.amount} ${args.token} from ${args.provider}`;
  }

  @CreateAction({
    name: 'add_liquidity',
    description: 'Add liquidity to a pool through the vault',
    schema: addLiquiditySchema,
  })
  async addLiquidity(args: AddLiquiditySchema): Promise<string> {
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

    const hash = await this.walletProvider.sendTransaction({
      to: args.vaultAddress,
      data,
    });

    await this.walletProvider.waitForTransactionReceipt(hash);

    return `Successfully added liquidity: ${args.amount0} ${args.token0} and ${args.amount1} ${args.token1}`;
  }

  @CreateAction({
    name: 'remove_liquidity',
    description: 'Remove liquidity from a pool through the vault',
    schema: removeLiquiditySchema,
  })
  async removeLiquidity(args: RemoveLiquiditySchema): Promise<string> {
    const data = encodeFunctionData({
      abi: VaultABI,
      functionName: 'removeLiquidity',
      args: [
        args.provider,
        args.token0,
        args.token1,
        BigInt(args.liquidityAmount),
      ],
    });

    const hash = await this.walletProvider.sendTransaction({
      to: args.vaultAddress,
      data,
    });

    await this.walletProvider.waitForTransactionReceipt(hash);

    return `Successfully removed ${args.liquidityAmount} LP tokens`;
  }

  @CreateAction({
    name: 'swap_tokens',
    description: 'Swap tokens through Uniswap via the vault',
    schema: swapTokenSchema,
  })
  async swapTokens(args: SwapTokenSchema): Promise<string> {
    const data = encodeFunctionData({
      abi: VaultABI,
      functionName: 'swapOnUniswap',
      args: [args.tokenIn, args.tokenOut, BigInt(args.amountIn), args.fee],
    });

    const hash = await this.walletProvider.sendTransaction({
      to: args.vaultAddress,
      data,
    });

    await this.walletProvider.waitForTransactionReceipt(hash);

    return `Successfully swapped ${args.amountIn} ${args.tokenIn} for ${args.tokenOut}`;
  }

  supportsNetwork = (_: Network) => true;
}

export const vaultActionProvider = () => new VaultActionProvider();
