import express from 'express';
import { createStrategy } from '../controllers/AgentController';

export const strategyRouter = express.Router();

/**
 * @swagger
 * /api/strategy:
 *   post:
 *     summary: Generate a portfolio strategy based on user description
 *     tags: [Strategy]
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
 *                 description: Natural language description of desired investment strategy
 *                 example: "I want a conservative strategy focused on stablecoin lending with at least 4% APY"
 *     responses:
 *       200:
 *         description: Strategy generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strategy:
 *                   $ref: '#/components/schemas/PortfolioStrategy'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
strategyRouter.post('/', createStrategy);
