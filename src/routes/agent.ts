import express from 'express';
import { handleMessage } from '../controllers/AgentController';
export const agentRouter = express.Router();

agentRouter.post('/message', handleMessage);
