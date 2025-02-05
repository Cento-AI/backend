import type { Request, Response } from 'express';
import { getCompoundReservesAPY } from '../services/CompoundService';
import type { ProtocolRates } from '../types/lending-protocol';

export async function getReservesData(_req: Request, res: Response) {
  try {
    const apyData = await getCompoundReservesAPY();
    const response: ProtocolRates = {
      protocol: 'compound',
      reserves: apyData,
    };
    return res.json(response);
  } catch (error) {
    console.error('Error in getReservesAPY:', error);
    return res.status(500).json({ error: 'Failed to fetch APY data' });
  }
}
