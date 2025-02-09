import {
  AgentKit,
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
import type { Address } from 'viem';
import { vaultActionProvider } from '../action-providers/VaultActionProvider';
import { vaultFactoryActionProvider } from '../action-providers/VaultFactoryActionProvider';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { PrivyWalletProvider } from '../providers/privy-provider';
import type { PortfolioRebalance } from '../types/portfolio-rebalance';
import type { PortfolioStrategy } from '../types/portfolio-strategy';
import type { StrategyAction } from '../types/strategy-action';
import type { UserVaultData } from '../types/vault';
import { cleanCdpKey } from '../utils/clean-cdp-key';
import { cleanLLMResponse } from '../utils/clean-llm-response';
import { getReservesAPY } from './AaveService';
import { getCompoundReservesAPY } from './CompoundService';
import { VaultFactoryService } from './VaultFactoryService';
import { VaultService } from './VaultService';

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

    const walletProvider = await PrivyWalletProvider.configureWithWallet({
      appId: process.env.PRIVY_APP_ID,
      appSecret: process.env.PRIVY_APP_SECRET,
      walletId: process.env.PRIVY_WALLET_ID,
    });

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
        recursionLimit: 100, // Increase from default 25
      },
    };

    this.agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a DeFi portfolio management agent that executes smart contract actions.
        
        When given a tool call format like:
        Call VaultActionProvider_lend_tokens with:
        {
          "name": "VaultActionProvider_lend_tokens",
          "args": { ... }
        }
        
        You must:
        1. Execute ONLY that specific tool call
        2. Do not analyze or suggest actions
        3. Do not return portfolio states
        4. Return only the transaction result
        
        IMPORTANT: When given a tool call, execute it directly without any other steps.
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
      const vault = this.userVaults.get(userAddress);
      if (!vault) {
        throw new Error('Vault not found');
      }

      const prompt = `
        Analyze the user's current portfolio and suggest lending actions.
        
        Current Portfolio:
        ${await this.getCurrentPortfolioState(userAddress)}
        
        Target Strategy:
        ${JSON.stringify(vault.strategy, null, 2)}
        
        Available Lending Rates:
        - Aave: ${await getReservesAPY()}
        - Compound: ${await getCompoundReservesAPY()}
        
        CORE RULES:
        1. If a token has a balance in currentAllocation.vault, it is available for lending
        2. The full vault balance of each token should be lent out to maximize returns
        3. Choose the protocol (aave|compound) with the best lending rate
        4. The targetAmount should be equal to the vault balance
        
        RESPONSE FORMAT:
        Return ONLY a raw JSON object with NO markdown, NO code blocks, and NO additional text.
        The response must start with { and end with }.
        
        {
          "currentPortfolio": {
            "totalValue": "string",
            "assets": [{ "symbol": "string", "balance": "string", "value": "string" }]
          },
          "suggestedActions": [{
            "asset": "string",
            "currentAmount": "string",
            "targetAmount": "string",
            "action": "lend_tokens",
            "protocol": "aave|compound"
          }],
          "explanation": "string describing why these actions were chosen"
        }
        
        IMPORTANT: 
        1. Any token with a non-zero vault balance must have a corresponding lending action
        2. Format must match exactly as shown above
        3. No additional text or formatting allowed
      `;

      const responses = await this.processMessage(prompt);
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
      let vaultAddress = await this.lazyLoadVault(userAddress);
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
      const vaultFactoryService = VaultFactoryService.getInstance();
      vaultAddress = (await vaultFactoryService.getVaultAddress(
        userAddress as `0x${string}`,
      )) as Address;
      if (!vaultAddress) {
        throw new Error('Failed to create vault');
      }

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
          totalBalance: balance.balance.toString(),
          currentAllocation: {
            vault: balance.balance.toString(),
            aave: balance.investedInAave.toString(),
            compound: balance.investedInCompound.toString(),
            uniswap: balance.investedInUniswap.toString(),
          },
          availableBalance: balance.balance.toString(),
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
        console.log('Executing action:', action);
        const tokenAddress =
          action.asset === 'USDC'
            ? '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
            : action.asset;

        let prompt: string;
        switch (action.action) {
          case 'lend_tokens':
            prompt = `Thought: I need to lend tokens
Action: lend_tokens
Action Input: {
  "vaultAddress": "${vault.vaultAddress}",
  "provider": "${action.protocol}",
  "token": "${tokenAddress}",
  "amount": "${Number(action.targetAmount)}"
}`;
            break;

          case 'withdraw_lent':
            prompt = `Thought: I need to withdraw lent tokens
Action: withdraw_lent
Action Input: {
  "vaultAddress": "${vault.vaultAddress}",
  "provider": "${action.protocol}",
  "token": "${tokenAddress}",
  "amount": "${Number(action.targetAmount)}"
}`;
            break;

          default:
            throw new Error(`Unsupported action: ${action.action}`);
        }

        console.log('Sending prompt:', prompt);
        const responses = await this.processMessage(prompt);
        console.log('Received responses:', responses);
        results.push(responses[responses.length - 1]);
      }

      vault.status = 'active';
      vault.lastUpdated = new Date();
      this.userVaults.set(userAddress, vault);

      return results;
    } catch (error) {
      console.error('Error executing strategy actions:', error);
      throw error;
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

  private async lazyLoadVault(
    userAddress: string,
  ): Promise<Address | undefined> {
    const vault = this.userVaults.get(userAddress);
    if (vault) {
      return vault.vaultAddress;
    }

    // Try to see if the vault already exists and fail fast
    const vaultFactoryService = VaultFactoryService.getInstance();
    const vaultAddress = await vaultFactoryService.getVaultAddress(
      userAddress as `0x${string}`,
    );

    return vaultAddress;
  }
}
