import type { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';

export async function handleMessage(req: Request, res: Response) {
  try {
    const { message, userAddress } = req.body;

    if (!message || !userAddress) {
      return res
        .status(400)
        .json({ error: 'Message and user address are required' });
    }

    const agentService = await AgentService.getInstance();
    const responses = await agentService.processMessage(message, userAddress);

    return res.json({ responses });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createStrategy(req: Request, res: Response) {
  try {
    const { userAddress, description } = req.body;

    if (!userAddress || !description) {
      return res
        .status(400)
        .json({ error: 'User address and strategy description are required' });
    }

    const agentService = await AgentService.getInstance();
    const strategy = await agentService.createStrategy(
      userAddress,
      description,
    );

    return res.json({ strategy });
  } catch (error) {
    console.error('Error creating strategy:', error);
    return res.status(500).json({ error: 'Failed to create strategy' });
  }
}

export async function applyStrategy(req: Request, res: Response) {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    const agentService = await AgentService.getInstance();
    const rebalance = await agentService.applyStrategy(userAddress);

    return res.json(rebalance);
  } catch (error) {
    console.error('Error applying strategy:', error);
    return res.status(500).json({ error: 'Failed to apply strategy' });
  }
}

export async function confirmStrategy(req: Request, res: Response) {
  try {
    const { userAddress, actions } = req.body;

    if (!userAddress || !actions) {
      return res
        .status(400)
        .json({ error: 'User address and actions are required' });
    }

    const agentService = await AgentService.getInstance();
    const result = await agentService.executeStrategyActions(
      userAddress,
      actions,
    );

    return res.json({ result });
  } catch (error) {
    console.error('Error executing strategy actions:', error);
    return res
      .status(500)
      .json({ error: 'Failed to execute strategy actions' });
  }
}
