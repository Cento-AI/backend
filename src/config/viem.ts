import { http, createPublicClient } from 'viem';
import { base } from 'viem/chains';

if (!process.env.BASE_RPC_URL) {
  throw new Error('BASE_RPC_URL environment variable is not set');
}

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
