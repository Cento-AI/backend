import type { Request, Response } from 'express';
import { getReservesAPY } from '../services/AaveService';

export async function getReservesData(_req: Request, res: Response) {
  try {
    const apyData = await getReservesAPY();
    return res.json({ reserves: apyData });
  } catch (error) {
    console.error('Error in getReservesAPY:', error);
    return res.status(500).json({ error: 'Failed to fetch APY data' });
  }
}
