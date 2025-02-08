import { z } from 'zod';
import { addressSchema } from './AddressSchema';

// Base schema that all vault actions will extend
export const baseVaultSchema = z.object({
  vaultAddress: addressSchema.describe("The user's vault contract address"),
});

export const lendTokenSchema = baseVaultSchema.extend({
  protocol: z
    .enum(['aave', 'compound'])
    .describe('The lending protocol to use'),
  token: addressSchema.describe('The token to lend'),
  amount: z.bigint().describe('The amount to lend with proper decimals'),
});
export type LendTokenSchema = z.infer<typeof lendTokenSchema>;

export const withdrawLentTokenSchema = baseVaultSchema.extend({
  protocol: z
    .enum(['aave', 'compound'])
    .describe('The lending protocol to use'),
  token: addressSchema.describe('The token to withdraw'),
  amount: z.bigint().describe('The amount to withdraw with proper decimals'),
});
export type WithdrawLentTokenSchema = z.infer<typeof withdrawLentTokenSchema>;

export const addLiquiditySchema = baseVaultSchema.extend({
  protocol: z.enum(['uniswap', 'aerodrome']).describe('The LP protocol to use'),
  token0: addressSchema.describe('The first token to add'),
  token1: addressSchema.describe('The second token to add'),
  amount0: z.bigint().describe('The amount of token0 to add'),
  amount1: z.bigint().describe('The amount of token1 to add'),
});
export type AddLiquiditySchema = z.infer<typeof addLiquiditySchema>;

export const removeLiquiditySchema = baseVaultSchema.extend({
  protocol: z.enum(['uniswap', 'aerodrome']).describe('The LP protocol to use'),
  token0: addressSchema.describe('The first token to remove'),
  token1: addressSchema.describe('The second token to remove'),
  lpAmount: z.bigint().describe('The amount of LP tokens to remove'),
});
export type RemoveLiquiditySchema = z.infer<typeof removeLiquiditySchema>;

export const swapTokenSchema = baseVaultSchema.extend({
  tokenIn: addressSchema.describe('The token to swap in'),
  tokenOut: addressSchema.describe('The token to swap out'),
  amountIn: z.bigint().describe('The amount to swap with proper decimals'),
  amountOutMin: z
    .bigint()
    .describe('The minimum amount to receive with proper decimals'),
  fee: z.bigint().describe('The fee tier for the swap'),
});
export type SwapTokenSchema = z.infer<typeof swapTokenSchema>;
