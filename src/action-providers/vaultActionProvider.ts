import type { ActionProvider } from '@coinbase/agentkit';
import type { Tool } from '@langchain/core/tools';
import type { Address } from 'viem';

// Define the supported actions
type VaultAction =
  | {
      type: 'lend';
      token: string;
      amount: string;
      protocol: 'aave' | 'compound';
    }
  | {
      type: 'withdraw';
      token: string;
      amount: string;
      protocol: 'aave' | 'compound';
    }
  | {
      type: 'addLiquidity';
      token0: string;
      token1: string;
      amount0: string;
      amount1: string;
    }
  | {
      type: 'removeLiquidity';
      token0: string;
      token1: string;
      lpAmount: string;
    };

export function vaultActionProvider(config: {
  vaultAddress: Address;
}): ActionProvider {
  return {
    name: 'vault',
    description:
      'Interact with the vault to manage lending and liquidity positions',
    tools: [
      {
        name: 'lendTokens',
        description: 'Lend tokens through the vault to a lending protocol',
        parameters: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token symbol to lend' },
            amount: { type: 'string', description: 'Amount to lend' },
            protocol: {
              type: 'string',
              enum: ['aave', 'compound'],
              description: 'Lending protocol to use',
            },
          },
          required: ['token', 'amount', 'protocol'],
        },
        execute: async ({ token, amount, protocol }) => {
          try {
            // Implementation will go here
            return `Successfully lent ${amount} ${token} to ${protocol}`;
          } catch (error) {
            throw new Error(`Failed to lend tokens: ${error}`);
          }
        },
      },
      {
        name: 'withdrawTokens',
        description: 'Withdraw tokens from lending protocol through the vault',
        parameters: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token symbol to withdraw' },
            amount: { type: 'string', description: 'Amount to withdraw' },
            protocol: {
              type: 'string',
              enum: ['aave', 'compound'],
              description: 'Lending protocol to withdraw from',
            },
          },
          required: ['token', 'amount', 'protocol'],
        },
        execute: async ({ token, amount, protocol }) => {
          try {
            // Implementation will go here
            return `Successfully withdrew ${amount} ${token} from ${protocol}`;
          } catch (error) {
            throw new Error(`Failed to withdraw tokens: ${error}`);
          }
        },
      },
      {
        name: 'addLiquidity',
        description: 'Add liquidity to a pool through the vault',
        parameters: {
          type: 'object',
          properties: {
            token0: { type: 'string', description: 'First token symbol' },
            token1: { type: 'string', description: 'Second token symbol' },
            amount0: { type: 'string', description: 'Amount of first token' },
            amount1: { type: 'string', description: 'Amount of second token' },
          },
          required: ['token0', 'token1', 'amount0', 'amount1'],
        },
        execute: async ({ token0, token1, amount0, amount1 }) => {
          try {
            // Implementation will go here
            return `Successfully added liquidity: ${amount0} ${token0} and ${amount1} ${token1}`;
          } catch (error) {
            throw new Error(`Failed to add liquidity: ${error}`);
          }
        },
      },
      {
        name: 'removeLiquidity',
        description: 'Remove liquidity from a pool through the vault',
        parameters: {
          type: 'object',
          properties: {
            token0: { type: 'string', description: 'First token symbol' },
            token1: { type: 'string', description: 'Second token symbol' },
            lpAmount: {
              type: 'string',
              description: 'Amount of LP tokens to burn',
            },
          },
          required: ['token0', 'token1', 'lpAmount'],
        },
        execute: async ({ token0, token1, lpAmount }) => {
          try {
            // Implementation will go here
            return `Successfully removed liquidity for ${token0}/${token1} pair`;
          } catch (error) {
            throw new Error(`Failed to remove liquidity: ${error}`);
          }
        },
      },
    ] as Tool[],
  };
}
