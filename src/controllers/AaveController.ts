import type { Request, Response } from 'express';
import { getReservesAPY } from '../services/AaveService';
import type { ProtocolRates } from '../types/lending-protocol';

export async function getReservesData(_req: Request, res: Response) {
  try {
    const apyData = await getReservesAPY();
    const response: ProtocolRates = {
      protocol: 'aave',
      reserves: apyData,
    };
    return res.json(response);
  } catch (error) {
    console.error('Error in getReservesAPY:', error);
    return res.status(500).json({ error: 'Failed to fetch APY data' });
  }
}
