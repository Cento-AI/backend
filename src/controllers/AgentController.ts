import type { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';

export async function handleMessage(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const agentService = await AgentService.getInstance();
    const responses = await agentService.processMessage(message);

    return res.json({ responses });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
