import express from 'express';
import { getReservesData } from '../controllers/AaveController';

export const aaveRouter = express.Router();

/**
 * @swagger
 * /api/aave/reserves/apy:
 *   get:
 *     summary: Get Aave reserve rates
 *     tags: [Aave]
 *     responses:
 *       200:
 *         description: List of Aave reserve APY rates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                     description: Token symbol
 *                   supplyAPY:
 *                     type: number
 *                     description: Supply APY in percentage
 */
aaveRouter.get('/reserves/apy', getReservesData);
