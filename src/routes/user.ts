import express from 'express';
import { getUserReserves } from '../controllers/UserController';

export const userRouter = express.Router();

userRouter.get('/reserves', getUserReserves);
