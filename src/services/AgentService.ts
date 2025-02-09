import {
  AgentKit,
  ViemWalletProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  erc20ActionProvider,
  walletActionProvider,
} from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { HumanMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { vaultActionProvider } from '../action-providers/VaultActionProvider';
import { vaultFactoryActionProvider } from '../action-providers/VaultFactoryActionProvider';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import type { PortfolioStrategy } from '../types/portfolio-strategy';
import type { UserVaultData } from '../types/vault';
import { cleanCdpKey } from '../utils/clean-cdp-key';
import { cleanLLMResponse } from '../utils/clean-llm-response';
import { getReservesAPY } from './AaveService';
import { getCompoundReservesAPY } from './CompoundService';
import { VaultFactoryService } from './VaultFactoryService';
import { VaultService } from './VaultService';
import { WalletService } from './WalletService';

interface StrategyAction {
  asset: string;
  currentAmount: string;
  targetAmount: string;
  action: 'deposit' | 'withdraw';
  protocol: 'aave' | 'compound';
}

interface PortfolioRebalance {
  currentPortfolio: {
    totalValue: string;
    assets: Array<{
      symbol: string;
      balance: string;
      value: string;
    }>;
  };
  suggestedActions: StrategyAction[];
}

export class AgentService {
  private static instance: AgentService;
  private agent: any;
  private config: any;
  private userVaults: Map<string, UserVaultData> = new Map();

  private constructor() {}

  public static async getInstance(): Promise<AgentService> {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
      await AgentService.instance.initialize();
    }
    return AgentService.instance;
  }

  private async initialize() {
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });

    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: cleanCdpKey(),
      networkId: process.env.NETWORK_ID || 'base-sepolia',
    };

    const walletProvider = new ViemWalletProvider(
      WalletService.getInstance().getWalletClient(),
    );

    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider(config),
        cdpWalletActionProvider(config),
        vaultActionProvider(),
        vaultFactoryActionProvider(),
      ],
    });

    const tools = await getLangChainTools(agentkit);
    const memory = new MemorySaver();
    this.config = {
      configurable: {
        thread_id: 'CDP AgentKit API Example!',
        recursionLimit: 50, // Increase recursion limit if needed
      },
    };

    this.agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a DeFi portfolio management agent that can interact with smart contracts using the Coinbase Developer Platform AgentKit.
        
        When creating a vault:
        1. Use the create_vault action directly with the user's address
        2. Do not try to check balances or perform additional actions
        3. Return the transaction result immediately
        
        When executing other actions:
        1. Check wallet details first to verify the network
        2. Request funds from faucet if on base-sepolia
        3. Execute the requested action
        4. Handle any 5XX errors by asking the user to try again
        
        Be direct and efficient in your actions, avoid unnecessary checks or steps.
      `,
    });
  }

  public async processMessage(
    message: string,
    args?: Record<string, unknown>,
  ): Promise<string[]> {
    const responses: string[] = [];

    try {
      const stream = await this.agent.stream(
        { messages: [new HumanMessage(message)] },
        this.config,
      );

      for await (const chunk of stream) {
        if ('agent' in chunk) {
          responses.push(chunk.agent.messages[0].content);
        } else if ('tools' in chunk) {
          responses.push(chunk.tools.messages[0].content);
        }
      }

      return responses;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  public async createStrategy(
    userAddress: string,
    description: string,
  ): Promise<PortfolioStrategy> {
    try {
      const prompt = `
        As a DeFi portfolio manager, analyze the following strategy description and create a structured portfolio strategy.
        Description: "${description}"
        
        Create a strategy that includes:
        1. Risk level (conservative, moderate, or aggressive)
        2. Allocation percentages between lending and liquidity provision (must total 100%)
        3. Asset preferences and constraints
        
        IMPORTANT: Return ONLY the raw JSON object, with NO markdown formatting, NO code blocks, NO line breaks  and NO additional text.
        The response should start with { and end with }.
        
        The JSON structure should be:
        {
          "riskLevel": "conservative|moderate|aggressive",
          "allocations": {
            "lending": number,
            "liquidity": number
          },
          "preferences": {
            "stablecoinsOnly": boolean,
            "preferredAssets": string[],
            "minimumAPY": number (optional)
          }
        }
      `;

      const responses = await this.processMessage(prompt, { userAddress });

      // Clean the response by removing markdown code block syntax
      const lastResponse = responses[responses.length - 1];
      const cleanedResponse = cleanLLMResponse(lastResponse);
      const strategyJson = JSON.parse(cleanedResponse) as PortfolioStrategy;

      // Validate the strategy structure
      this.validateStrategy(strategyJson);

      return strategyJson;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw new Error('Failed to create portfolio strategy');
    }
  }

  public async applyStrategy(userAddress: string): Promise<PortfolioRebalance> {
    try {
      // Store vault data
      const vault = this.userVaults.get(userAddress);
      if (!vault) {
        throw new Error('Vault not found');
      }

      const prompt = `
        Analyze the user's current portfolio and suggest actions to align with the given strategy.
        
        Current Portfolio:
        ${await this.getCurrentPortfolioState(userAddress)}
        zWXtTL4KTRqNVk2GiRwGBvJMLTDvXz2wCJVYhVGryKjJHT9qqGaqUBii8FEYajNPgjJXkFrY38XrPtbVPYTfyGpfuXqL3ixoPXnG
        Target Strategy:
        ${JSON.stringify(vault.strategy, null, 2)}
        
        Available Protocols:
        - Aave lending rates: ${await getReservesAPY()}
        - Compound lending rates: ${await getCompoundReservesAPY()}
        
        Suggest specific actions to rebalance the portfolio according to the strategy.
        Consider:
        1. Current asset allocation vs target allocation
        2. Preferred assets from strategy
        3. Minimum APY requirements
        4. Risk level constraints

        IMPORTANT: Return ONLY the raw JSON object, with NO markdown formatting, NO code blocks, NO line breaks  and NO additional text.
        The response should start with { and end with }.
        
        Format response as a JSON object with:
        {
          "currentPortfolio": {
            "totalValue": "string",
            "assets": [{ "symbol": "string", "balance": "string", "value": "string" }]
          },
          "suggestedActions": [{
            "asset": "string",
            "currentAmount": "string",
            "targetAmount": "string",
            "action": "deposit|withdraw",
            "protocol": "aave|compound"
          }]
        }
      `;

      const responses = await this.processMessage(prompt, { userAddress });
      const lastResponse = responses[responses.length - 1];
      const cleanedResponse = cleanLLMResponse(lastResponse);
      const rebalance = JSON.parse(cleanedResponse) as PortfolioRebalance;

      return rebalance;
    } catch (error) {
      console.error('Error applying strategy:', error);
      throw new Error('Failed to apply portfolio strategy');
    }
  }

  public async createVault(
    userAddress: string,
    strategy: PortfolioStrategy,
  ): Promise<string> {
    try {
      const vault = this.userVaults.get(userAddress);
      if (vault) {
        return vault.vaultAddress;
      }

      // Try to see if the vault already exists and fail fast
      const vaultFactoryService = VaultFactoryService.getInstance();
      let vaultAddress = await vaultFactoryService.getVaultAddress(
        userAddress as `0x${string}`,
      );

      if (vaultAddress) {
        // Store vault data
        this.userVaults.set(userAddress, {
          vaultAddress,
          strategy,
          status: 'created',
          createdAt: new Date(),
          lastUpdated: new Date(),
        });

        return vaultAddress;
      }

      const prompt = `Create a new vault using the following action:

Thought: I will use the create_vault action to create a new vault
Action: create_vault
Action Input: {
  "owner": "${userAddress}"
}

Do not add any explanations or additional steps.`;

      await this.processMessage(prompt, { owner: userAddress });

      // Get the vault address using VaultFactoryService
      vaultAddress = await vaultFactoryService.getVaultAddress(
        userAddress as `0x${string}`,
      );

      // Store vault data
      this.userVaults.set(userAddress, {
        vaultAddress,
        strategy,
        status: 'created',
        createdAt: new Date(),
        lastUpdated: new Date(),
      });

      return vaultAddress;
    } catch (error) {
      console.error('Error creating vault:', error);
      throw new Error('Failed to create vault');
    }
  }

  private async getCurrentPortfolioState(userAddress: string): Promise<string> {
    try {
      const vault = this.userVaults.get(userAddress);
      if (!vault) {
        throw new Error('Vault not found');
      }

      const vaultService = VaultService.getInstance();
      const balances = await vaultService.getMultipleAssetBalances(
        vault.vaultAddress,
        SUPPORTED_TOKENS,
      );

      const portfolioState = {
        vaultAddress: vault.vaultAddress,
        assets: balances.map((balance) => ({
          asset: balance.asset,
          vaultBalance: balance.balance.toString(),
          aaveBalance: balance.investedInAave.toString(),
          compoundBalance: balance.investedInCompound.toString(),
          uniswapBalance: balance.investedInUniswap.toString(),
        })),
      };

      return JSON.stringify(portfolioState);
    } catch (error) {
      console.error('Error getting portfolio state:', error);
      throw new Error('Failed to get portfolio state');
    }
  }

  public async executeStrategyActions(
    userAddress: string,
    actions: StrategyAction[],
  ): Promise<string[]> {
    try {
      const vault = this.userVaults.get(userAddress);
      if (!vault) {
        throw new Error('Vault not found');
      }

      const results: string[] = [];

      for (const action of actions) {
        const prompt = `
          Execute the following action on the vault:
          Vault Address: ${vault.vaultAddress}
          Action: ${action.action}
          Protocol: ${action.protocol}
          Asset: ${action.asset}
          Amount: ${action.targetAmount}

          Use the appropriate vault action (lend_tokens, withdraw_lent, add_liquidity, remove_liquidity and swap_tokens) to execute this operation.
        `;

        const responses = await this.processMessage(prompt, { userAddress });
        results.push(responses[responses.length - 1]);
      }

      // Update vault status
      vault.status = 'active';
      vault.lastUpdated = new Date();
      this.userVaults.set(userAddress, vault);

      return results;
    } catch (error) {
      console.error('Error executing strategy actions:', error);
      throw new Error('Failed to execute strategy actions');
    }
  }

  /**
   * Utils (this should be in a separate file)
   */

  // TODO Should be a validator with a schema
  private validateStrategy(
    strategy: PortfolioStrategy,
  ): asserts strategy is PortfolioStrategy {
    if (
      !strategy.riskLevel ||
      !['conservative', 'moderate', 'aggressive'].includes(strategy.riskLevel)
    ) {
      throw new Error('Invalid risk level');
    }

    if (
      !strategy.allocations ||
      typeof strategy.allocations.lending !== 'number' ||
      typeof strategy.allocations.liquidity !== 'number' ||
      Math.abs(
        strategy.allocations.lending + strategy.allocations.liquidity - 100,
      ) > 0.01
    ) {
      throw new Error('Invalid allocations');
    }

    if (
      !strategy.preferences ||
      typeof strategy.preferences.stablecoinsOnly !== 'boolean' ||
      !Array.isArray(strategy.preferences.preferredAssets)
    ) {
      throw new Error('Invalid preferences');
    }
  }
}
