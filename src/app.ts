import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { aaveRouter } from './routes/aave';
import { agentRouter } from './routes/agent';
import { compoundRouter } from './routes/compound';
import { userRouter } from './routes/user';
import { validateEnvironment } from './utils/validateEnv';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnvironment();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agent', agentRouter);
app.use('/api/aave', aaveRouter);
app.use('/api/compound', compoundRouter);
app.use('/api/user', userRouter);

// Error handling
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  },
);

export default app;
