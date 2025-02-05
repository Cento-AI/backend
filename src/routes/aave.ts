import express from 'express';
import { getReservesData } from '../controllers/AaveController';

export const aaveRouter = express.Router();

aaveRouter.get('/reserves/apy', getReservesData);
