import express from 'express';
import { getUserReserves } from '../controllers/UserController';

export const userRouter = express.Router();

/**
 * @swagger
 * /api/user/reserves:
 *   get:
 *     summary: Get user's positions across protocols
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User's wallet address
 *     responses:
 *       200:
 *         description: User's positions in different protocols
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   protocol:
 *                     type: string
 *                     enum: [aave, compound]
 *                   reserves:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         symbol:
 *                           type: string
 *                         underlyingAsset:
 *                           type: string
 *                         balance:
 *                           type: string
 *       400:
 *         description: Invalid address provided
 */
userRouter.get('/reserves', getUserReserves);
