import * as fs from 'fs';
import {
  AgentKit,
  CdpWalletProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  walletActionProvider,
  wethActionProvider,
} from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { HumanMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

export class AgentService {
  private static instance: AgentService;
  private agent: any;
  private config: any;
  private readonly WALLET_DATA_FILE = 'wallet_data.txt';

  private constructor() {}

  public static async getInstance(): Promise<AgentService> {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
      await AgentService.instance.initialize();
    }
    return AgentService.instance;
  }

  private async initialize() {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });

    let walletDataStr: string | null = null;

    if (fs.existsSync(this.WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(this.WALLET_DATA_FILE, 'utf8');
      } catch (error) {
        console.error('Error reading wallet data:', error);
      }
    }

    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      ),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || 'base-sepolia',
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            '\n',
          ),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            '\n',
          ),
        }),
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

    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(this.WALLET_DATA_FILE, JSON.stringify(exportedWallet));
  }

  public async processMessage(message: string): Promise<string[]> {
    const responses: string[] = [];

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
  }
}
