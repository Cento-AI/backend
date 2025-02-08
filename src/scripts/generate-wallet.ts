import dotenv from 'dotenv';
import { generateAgentWallet } from '../utils/generate-agent-wallet';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Generating agent wallet...');
    await generateAgentWallet();
    console.log('Agent wallet generation complete!');
  } catch (error) {
    console.error('Failed to generate agent wallet:', error);
    process.exit(1);
  }
}

main();
