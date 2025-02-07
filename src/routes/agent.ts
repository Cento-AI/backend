import express from 'express';
import {
  applyStrategy,
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
 *     summary: Apply a portfolio strategy
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - strategy
 *             properties:
 *               userAddress:
 *                 type: string
 *               strategy:
 *                 $ref: '#/components/schemas/PortfolioStrategy'
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
 */
agentRouter.post('/apply-strategy', applyStrategy);
