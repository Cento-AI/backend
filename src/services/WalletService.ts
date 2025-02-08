import { type WalletClient, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { VIEM_CONFIG } from '../config/viem';

export class WalletService {
  private static instance: WalletService;
  private walletClient: WalletClient;

  private constructor() {
    if (!process.env.AGENT_PRIVATE_KEY) {
      throw new Error('AGENT_PRIVATE_KEY not found in environment variables');
    }

    const account = privateKeyToAccount(
      process.env.AGENT_PRIVATE_KEY as `0x${string}`,
    );

    this.walletClient = createWalletClient({
      account,
      ...VIEM_CONFIG,
    });
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public getWalletClient(): WalletClient {
    return this.walletClient;
  }

  public getAccount() {
    return this.walletClient.account;
  }
}
