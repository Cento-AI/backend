import { z } from 'zod';
import { addressSchema } from './AddressSchema';

// For createVault(address owner)
export const createVaultSchema = z.object({
  owner: addressSchema.describe("The vault's owner address"),
});

export type CreateVaultSchema = z.infer<typeof createVaultSchema>;
