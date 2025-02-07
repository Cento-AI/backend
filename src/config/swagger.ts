import type { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DeFi Portfolio Manager API',
      version: '1.0.0',
      description: 'API for managing DeFi portfolios with AI assistance',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export default swaggerOptions;
