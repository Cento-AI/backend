import {
  AgentKit,
  CdpWalletProvider,
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
import type { PortfolioStrategy } from '../types/portfolio-strategy';
import { getReservesAPY } from './AaveService';
import { getCompoundReservesAPY } from './CompoundService';

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
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      ),
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet({
      ...config,
      networkId: process.env.NETWORK_ID || 'base-sepolia',
    });

    // Initialize CDP Wallet Provider
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
    this.config = { configurable: { thread_id: 'CDP AgentKit API Example!' } };

    this.agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later.
        `,
    });
  }

  public async processMessage(
    message: string,
    _userAddress: string,
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
        
        Format your response as a JSON object with the following structure:
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
        
        Only respond with the JSON object, no additional text.
      `;

      const responses = await this.processMessage(prompt, userAddress);

      // Parse the last response as JSON (assuming it's the strategy)
      const strategyJson = JSON.parse(
        responses[responses.length - 1],
      ) as PortfolioStrategy;

      // Validate the strategy structure
      this.validateStrategy(strategyJson);

      return strategyJson;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw new Error('Failed to create portfolio strategy');
    }
  }

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

  public async applyStrategy(
    userAddress: string,
    strategy: PortfolioStrategy,
  ): Promise<PortfolioRebalance> {
    try {
      const prompt = `
        Analyze the user's current portfolio and suggest actions to align with the given strategy.
        
        Current Portfolio:
        ${await this.getCurrentPortfolioState(userAddress)}
        
        Target Strategy:
        ${JSON.stringify(strategy, null, 2)}
        
        Available Protocols:
        - Aave lending rates: ${await getReservesAPY()}
        - Compound lending rates: ${await getCompoundReservesAPY()}
        
        Suggest specific actions to rebalance the portfolio according to the strategy.
        Consider:
        1. Current asset allocation vs target allocation
        2. Preferred assets from strategy
        3. Minimum APY requirements
        4. Risk level constraints
        
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

      const responses = await this.processMessage(prompt, userAddress);
      const rebalance = JSON.parse(responses[responses.length - 1]);

      return rebalance;
    } catch (error) {
      console.error('Error applying strategy:', error);
      throw new Error('Failed to apply portfolio strategy');
    }
  }

  private async getCurrentPortfolioState(userAddress: string): Promise<string> {
    // Get balances from both protocols
    const [aaveBalances, compoundBalances] = await Promise.all([
      this.getAaveBalances(userAddress),
      this.getCompoundBalances(userAddress),
    ]);

    return JSON.stringify({
      aave: aaveBalances,
      compound: compoundBalances,
    });
  }
}
