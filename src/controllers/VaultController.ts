import type { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';

export async function createVault(req: Request, res: Response) {
  try {
    const { userAddress, strategy } = req.body;

    if (!userAddress || !strategy) {
      return res
        .status(400)
        .json({ error: 'User address and strategy are required' });
    }

    const agentService = await AgentService.getInstance();
    const vaultAddress = await agentService.createVault(userAddress, strategy);

    return res.json({ vaultAddress });
  } catch (error) {
    console.error('Error creating vault:', error);
    return res.status(500).json({ error: 'Failed to create vault' });
  }
}
