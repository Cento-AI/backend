export const CompoundCometABI = [
  {
    inputs: [],
    name: 'getUtilization',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'uint256', name: 'utilization' }],
    name: 'getSupplyRate',
    outputs: [{ type: 'uint64', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'address', name: 'priceFeed' }],
    name: 'getPrice',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
