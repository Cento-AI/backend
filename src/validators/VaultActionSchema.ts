import { z } from 'zod';
import { addressSchema } from './AddressSchema';

// Base schema that all vault actions will extend
export const baseVaultSchema = z.object({
  vaultAddress: addressSchema.describe("The user's vault contract address"),
});

// For lendTokens(string provider, address token, uint256 amount)
export const lendTokenSchema = baseVaultSchema.extend({
  provider: z
    .enum(['aave', 'compound'])
    .describe('The lending protocol to use'),
  token: addressSchema.describe('The token to lend'),
  amount: z.bigint().describe('The amount to lend with proper decimals'),
});
export type LendTokenSchema = z.infer<typeof lendTokenSchema>;

// For withdrawLentTokens(string provider, address token, uint256 amount)
export const withdrawLentTokenSchema = baseVaultSchema.extend({
  provider: z
    .enum(['aave', 'compound'])
    .describe('The lending protocol to use'),
  token: addressSchema.describe('The token to withdraw'),
  amount: z.bigint().describe('The amount to withdraw with proper decimals'),
});
export type WithdrawLentTokenSchema = z.infer<typeof withdrawLentTokenSchema>;

// For addLiquidity(string protocol, address token0, address token1, uint256 amount0, uint256 amount1, uint24 fee, int24 tickLower, int24 tickUpper)
export const addLiquiditySchema = baseVaultSchema.extend({
  provider: z.enum(['uniswap', 'aerodrome']).describe('The LP protocol to use'),
  token0: addressSchema.describe('The first token to add'),
  token1: addressSchema.describe('The second token to add'),
  amount0: z.bigint().describe('The amount of token0 to add'),
  amount1: z.bigint().describe('The amount of token1 to add'),
  fee: z.number().describe('The fee tier in basis points'),
  tickLower: z.number().describe('The lower tick of the position'),
  tickUpper: z.number().describe('The upper tick of the position'),
});
export type AddLiquiditySchema = z.infer<typeof addLiquiditySchema>;

// For removeLiquidity(string provider, address token0, address token1, uint256 liquidityAmount)
export const removeLiquiditySchema = baseVaultSchema.extend({
  provider: z.enum(['uniswap', 'aerodrome']).describe('The LP protocol to use'),
  token0: addressSchema.describe('The first token to remove'),
  token1: addressSchema.describe('The second token to remove'),
  liquidityAmount: z.bigint().describe('The amount of LP tokens to remove'),
});
export type RemoveLiquiditySchema = z.infer<typeof removeLiquiditySchema>;

// For swapOnUniswap(address _tokenIn, address _tokenOut, uint256 _amountIn, uint24 _fee)
export const swapTokenSchema = baseVaultSchema.extend({
  tokenIn: addressSchema.describe('The token to swap in'),
  tokenOut: addressSchema.describe('The token to swap out'),
  amountIn: z.bigint().describe('The amount to swap with proper decimals'),
  fee: z.number().describe('The fee tier in basis points'),
});
export type SwapTokenSchema = z.infer<typeof swapTokenSchema>;
