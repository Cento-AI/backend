import express from 'express';
import { getReservesData } from '../controllers/CompoundController';

export const compoundRouter = express.Router();

compoundRouter.get('/reserves/apy', getReservesData);
