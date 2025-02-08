import express from 'express';
import {
  applyStrategy,
  confirmStrategy,
  createStrategy,
  handleMessage,
} from '../controllers/AgentController';

export const agentRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PortfolioStrategy:
 *       type: object
 *       properties:
 *         riskLevel:
 *           type: string
 *           enum: [conservative, moderate, aggressive]
 *         allocations:
 *           type: object
 *           properties:
 *             lending:
 *               type: number
 *             liquidity:
 *               type: number
 *         preferences:
 *           type: object
 *           properties:
 *             stablecoinsOnly:
 *               type: boolean
 *             preferredAssets:
 *               type: array
 *               items:
 *                 type: string
 *             minimumAPY:
 *               type: number
 */

/**
 * @swagger
 * /api/agent/strategy:
 *   post:
 *     summary: Create a portfolio strategy
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - description
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: User's wallet address
 *               description:
 *                 type: string
 *                 description: Natural language description of desired strategy
 *     responses:
 *       200:
 *         description: Strategy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strategy:
 *                   type: object
 *                   properties:
 *                     riskLevel:
 *                       type: string
 *                       enum: [conservative, moderate, aggressive]
 *                     allocations:
 *                       type: object
 *                       properties:
 *                         lending:
 *                           type: number
 *                         liquidity:
 *                           type: number
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         stablecoinsOnly:
 *                           type: boolean
 *                         preferredAssets:
 *                           type: array
 *                           items:
 *                             type: string
 *                         minimumAPY:
 *                           type: number
 */
agentRouter.post('/strategy', createStrategy);

/**
 * @swagger
 * /api/agent/message:
 *   post:
 *     summary: Send a message to the agent
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - message
 *             properties:
 *               userAddress:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responses:
 *                   type: array
 *                   items:
 *                     type: string
 */
agentRouter.post('/message', handleMessage);

/**
 * @swagger
 * /api/agent/apply-strategy:
 *   post:
 *     summary: Apply stored strategy to user's funded vault
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: User's wallet address
 *     responses:
 *       200:
 *         description: Strategy application plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPortfolio:
 *                   type: object
 *                   properties:
 *                     totalValue:
 *                       type: string
 *                     assets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           symbol:
 *                             type: string
 *                           balance:
 *                             type: string
 *                           value:
 *                             type: string
 *                 suggestedActions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       asset:
 *                         type: string
 *                       currentAmount:
 *                         type: string
 *                       targetAmount:
 *                         type: string
 *                       action:
 *                         type: string
 *                         enum: [deposit, withdraw]
 *                       protocol:
 *                         type: string
 *                         enum: [aave, compound]
 *       400:
 *         description: Invalid request parameters or vault not found
 *       500:
 *         description: Server error
 */
agentRouter.post('/apply-strategy', applyStrategy);

/**
 * @swagger
 * /api/agent/confirm-strategy:
 *   post:
 *     summary: Execute confirmed strategy actions on the vault
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - actions
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: User's wallet address
 *               actions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     asset:
 *                       type: string
 *                     currentAmount:
 *                       type: string
 *                     targetAmount:
 *                       type: string
 *                     action:
 *                       type: string
 *                       enum: [deposit, withdraw]
 *                     protocol:
 *                       type: string
 *                       enum: [aave, compound]
 *     responses:
 *       200:
 *         description: Strategy actions executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Transaction results for each action
 */
agentRouter.post('/confirm-strategy', confirmStrategy);
