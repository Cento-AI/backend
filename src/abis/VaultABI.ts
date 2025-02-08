export const VaultABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_agent',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_aavePool',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_compoundUsdc',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_uniswapRouter',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_uniswapFactory',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'aavePool',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IPool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addLiquidity',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'token0',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'token1',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount0',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amount1',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'fee',
        type: 'uint24',
        internalType: 'uint24',
      },
      {
        name: 'tickLower',
        type: 'int24',
        internalType: 'int24',
      },
      {
        name: 'tickUpper',
        type: 'int24',
        internalType: 'int24',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'agent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'compoundUsdc',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract CometMainInterface',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'depositERC20',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAaveLiquidityStatus',
    inputs: [],
    outputs: [
      {
        name: 'totalCollateralBase',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'totalDebtBase',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'availableBorrowsBase',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentLiquidationThreshold',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'ltv',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'healthFactor',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCompoundLiquidityStatus',
    inputs: [],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getStruct',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Vault.UserBalance',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'balance',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'investedInAave',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'investedInCompound',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'investedInUniswap',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUniswapLiquidityStatus',
    inputs: [
      {
        name: '_tokenA',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_tokenB',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_fee',
        type: 'uint24',
        internalType: 'uint24',
      },
    ],
    outputs: [
      {
        name: 'liquidity',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'amount0',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amount1',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lendTokens',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'removeLiquidity',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'token0',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'token1',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'liquidityAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setAgent',
    inputs: [
      {
        name: '_agent',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapOnUniswap',
    inputs: [
      {
        name: '_tokenIn',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_tokenOut',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_amountIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_fee',
        type: 'uint24',
        internalType: 'uint24',
      },
    ],
    outputs: [
      {
        name: 'amountOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'tokenAddressToStruct',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'investedInAave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'investedInCompound',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'investedInUniswap',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'uniswapFactory',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IUniswapV3Factory',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'uniswapRouter',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISwapRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdrawERC20',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawLentTokens',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'amountWithdrawn',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ERC20Deposited',
    inputs: [
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ERC20Withdrawn',
    inputs: [
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LiquidityAdded',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token0',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'token1',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'liquidity',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'amount0',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount1',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LiquidityRemoved',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token0',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'token1',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'liquidity',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'amount0',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount1',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LiquiditySupplied',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LiquidityWithdrawn',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TokensSwapped',
    inputs: [
      {
        name: 'protocol',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenIn',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amountIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amountOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AerodromeNotImplemented',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidProtocol',
    inputs: [
      {
        name: 'protocol',
        type: 'string',
        internalType: 'string',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const;
