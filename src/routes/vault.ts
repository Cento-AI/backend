import express from 'express';
import { createVault } from '../controllers/VaultController';

export const vaultRouter = express.Router();

/**
 * @swagger
 * /api/vault:
 *   post:
 *     summary: Create a new vault for a user
 *     tags: [Vault]
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
 *                 description: User's wallet address
 *               strategy:
 *                 $ref: '#/components/schemas/PortfolioStrategy'
 *     responses:
 *       200:
 *         description: Vault created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vaultAddress:
 *                   type: string
 *                   description: The address of the created vault
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
vaultRouter.post('/', createVault);
