import { http, createPublicClient } from 'viem';
import { base } from 'viem/chains';

if (!process.env.BASE_RPC_URL) {
  throw new Error('BASE_RPC_URL environment variable is not set');
}

export const VIEM_CONFIG = {
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
};

export const publicClient = createPublicClient(VIEM_CONFIG);
