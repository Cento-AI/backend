import express from 'express';
import {
  createStrategy,
  handleMessage,
} from '../controllers/AgentController';

export const agentRouter = express.Router();

agentRouter.post('/message', handleMessage);
agentRouter.post('/strategy', createStrategy);
