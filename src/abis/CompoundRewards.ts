export const CompoundRewardsABI = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'rewardConfig',
    outputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint64', name: 'rescaleFactor', type: 'uint64' },
      { internalType: 'bool', name: 'shouldUpscale', type: 'bool' },
      { internalType: 'uint256', name: 'multiplier', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'comet', type: 'address' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'getRewardOwed',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'owed', type: 'uint256' },
        ],
        internalType: 'struct CometRewards.RewardOwed',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
