# Cento AI Backend
![Cento AI Logo](images/image.png)

Cento AI is an autonomous DeFi portfolio manager built for the ETHGlobal Agentic Hackathon. This repository contains the backend code and AI agent implementation that powers Cento's automated portfolio management capabilities.

## Overview

Cento AI helps users manage their DeFi portfolios by:
- Creating personalized investment strategies based on user preferences
- Managing smart contract vaults for secure asset management
- Automatically allocating assets across lending protocols
- Optimizing returns based on current market conditions
- Executing transactions through secure smart contracts

The project was initially inspired by Coinbase's AgentKit demo but has evolved significantly to create a specialized DeFi management solution.

## Technical Stack

- **Framework**: Express.js with TypeScript
- **AI Integration**: LangChain + AgentKit
- **Blockchain**: Base/Base Sepolia
- **Smart Contracts**: Custom Vault system
- **Wallet Infrastructure**: Privy Server Wallets
- **Documentation**: Swagger/OpenAPI

## Key Features

- **Strategy Creation**: AI-powered creation of personalized investment strategies
- **Vault Management**: Secure asset management through smart contract vaults
- **Secure Transactions**: Powered by Privy Server Wallets
- **Protocol Integration**: 
  - Aave lending
  - Compound lending
  - (More protocols coming soon)
- **Automated Optimization**: Continuous monitoring and rebalancing of positions
- **Risk Management**: Strategy enforcement based on user risk preferences

## API Documentation

The API is fully documented using Swagger/OpenAPI. Once the server is running, you can access the documentation at:
http://localhost:3000/api-docs

## Getting Started

### Prerequisites
- Node.js v20.x
- pnpm
- Base Sepolia RPC URL
- OpenAI API Key
- Coinbase Developer Platform API Keys
- Privy App Credentials
- Private key for transaction signing

### Environment Variables
Create a `.env` file with:
```
# Server Configuration
PORT=3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Coinbase Developer Platform (CDP) Configuration
CDP_API_KEY_PRIVATE_KEY=your_cdp_private_key
CDP_API_KEY_NAME=your_cdp_key_name
NETWORK_ID=base-sepolia

# RPC Configuration
BASE_RPC_URL=https://sepolia.base.org
MAINNET_BASE_RPC_URL=https://mainnet.base.org

# Agent Wallet Configuration
AGENT_PRIVATE_KEY=your_agent_private_key

# Privy Configuration
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret
PRIVY_WALLET_ID=your_privy_wallet_id
```

### Installation
```bash
# Install dependencies
pnpm install

# Generate agent wallet (if needed)
pnpm generate-wallet

# Build the project
pnpm build

# Start the server
pnpm start

# Development mode
pnpm dev
```

## Development

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test
```

## Architecture

- `src/services/`: Core business logic and blockchain interactions
- `src/controllers/`: API route handlers
- `src/action-providers/`: AgentKit action implementations
- `src/providers/`: Wallet providers (Privy Server Wallet integration)
- `src/validators/`: Request/response validation schemas
- `src/types/`: TypeScript type definitions
- `src/abis/`: Smart contract ABIs

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built during ETHGlobal Agentic Hackathon
- Based on initial concepts from Coinbase's AgentKit
- Powered by Privy Server Wallets
- Special thanks to the Base and ETHGlobal teams