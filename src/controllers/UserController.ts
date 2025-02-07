import type { Request, Response } from 'express';
import { getUserReserves as getAaveReserves } from '../services/AaveService';
import { getUserReserves as getCompoundReserves } from '../services/CompoundService';
import type { UserReserveData } from '../types/lending-protocol';

interface UserProtocolReserves {
  protocol: 'aave' | 'compound';
  reserves: UserReserveData[];
}

export async function getUserReserves(req: Request, res: Response) {
  try {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Valid address is required' });
    }

    const [aaveReserves, compoundReserves] = await Promise.all([
      getAaveReserves(address),
      getCompoundReserves(address as `0x${string}`),
    ]);

    const response: UserProtocolReserves[] = [
      { protocol: 'aave', reserves: aaveReserves },
      { protocol: 'compound', reserves: compoundReserves },
    ].filter((protocol) => protocol.reserves.length > 0);

    return res.json(response);
  } catch (error) {
    console.error('Error fetching user reserves:', error);
    return res.status(500).json({ error: 'Failed to fetch user reserves' });
  }
}
