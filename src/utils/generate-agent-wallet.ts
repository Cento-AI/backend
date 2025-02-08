import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { cleanCdpKey } from './clean-cdp-key';

export async function generateAgentWallet(): Promise<Wallet> {
  try {
    if (!process.env.CDP_API_KEY_NAME) {
      throw new Error('CDP API credentials not found in environment variables');
    }

    console.log('Configuring Coinbase...');
    Coinbase.configure({
      apiKeyName: process.env.CDP_API_KEY_NAME,
      privateKey: cleanCdpKey(),
    });

    console.log('Creating wallet...');
    // Create a new wallet
    const wallet = await Wallet.create();
    console.log('Agent wallet created:', await wallet.getDefaultAddress());

    // Fund the wallet using the faucet (only works on testnet)
    await wallet.faucet();
    console.log('Agent wallet funded');

    // Export wallet data for debugging
    const data = wallet.export();
    console.log('Wallet data:', data);

    return wallet;
  } catch (error) {
    console.error('Error generating agent wallet:', error);
    throw new Error('Failed to generate agent wallet');
  }
}
