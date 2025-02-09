curl -X POST http://localhost:3000/api/strategy \
-H "Content-Type: application/json" \
-d '{
  "userAddress": "0xYourWalletAddress",
  "description": "I want a conservative strategy focused on stablecoin lending with 70% in lending and 30% in liquidity pools, preferring USDC with minimum 4% APY"
}'

curl -X POST http://localhost:3000/api/vault \
-H "Content-Type: application/json" \
-d '{
  "userAddress": "0xYourWalletAddress",
  "strategy": {
    "riskLevel": "conservative",
    "allocations": {
      "lending": 70,
      "liquidity": 30
    },
    "preferences": {
      "stablecoinsOnly": true,
      "preferredAssets": ["USDC"],
      "minimumAPY": 4
    }
  }
}'

curl -X POST http://localhost:3000/api/agent/apply-strategy \
-H "Content-Type: application/json" \
-d '{
  "userAddress": "0xYourWalletAddress"
}'

curl -X POST http://localhost:3000/api/agent/confirm-strategy \
-H "Content-Type: application/json" \
-d '{
  "userAddress": "0xYourWalletAddress",
  "actions": [
    {
      "asset": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "currentAmount": "1000000000",
      "targetAmount": "700000000",
      "action": "deposit",
      "protocol": "aave"
    },
    {
      "asset": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "currentAmount": "300000000",
      "targetAmount": "300000000",
      "action": "deposit",
      "protocol": "compound"
    }
  ]
}'