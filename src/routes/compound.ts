import express from 'express';
import { getReservesData } from '../controllers/CompoundController';

export const compoundRouter = express.Router();

/**
 * @swagger
 * /api/compound/reserves/apy:
 *   get:
 *     summary: Get Compound reserve rates
 *     tags: [Compound]
 *     responses:
 *       200:
 *         description: List of Compound reserve APY rates
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
compoundRouter.get('/reserves/apy', getReservesData);
