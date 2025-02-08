import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().optional().default('3000'),
  CDP_API_KEY_NAME: z.string().nonempty(),
  CDP_API_KEY_PRIVATE_KEY: z.string().nonempty(),
  OPENAI_API_KEY: z.string().nonempty(),
  NETWORK_ID: z.string().optional().default('base-sepolia'),
  BASE_RPC_URL: z.string().nonempty(),
  AGENT_PRIVATE_KEY: z
    .string()
    .nonempty()
    .regex(/^0x[a-fA-F0-9]{64}$/), // Hex private key
});

export function validateEnvironment(): void {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}
