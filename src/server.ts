// src/server.ts
import express from 'express';
import cors from 'cors';
import { RaydiumPoolFinder } from './pool-finder';
import { validateTokenAddress, errorHandler } from './utils';
import { config } from 'dotenv';

config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const poolFinder = new RaydiumPoolFinder(process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Find pool endpoint
app.get('/api/pool', async (req, res, next) => {
  try {
    const { tokenA, tokenB } = req.query;

    // Validate input
    if (!tokenA || !tokenB) {
      return res.status(400).json({
        error: 'Missing required parameters: tokenA and tokenB addresses required'
      });
    }

    // Validate token addresses
    if (!validateTokenAddress(tokenA as string) || !validateTokenAddress(tokenB as string)) {
      return res.status(400).json({
        error: 'Invalid token address format'
      });
    }

    // Find pool
    const result = await poolFinder.findPool({
      tokenA: tokenA as string,
      tokenB: tokenB as string
    });

    return res.json({
      success: true,
      data: {
        poolId: result.poolId,
        timestamp: result.timestamp,
        tokenPair: result.tokenPair
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get pool info endpoint
app.get('/api/pool/:poolId', async (req, res, next) => {
  try {
    const { poolId } = req.params;

    if (!validateTokenAddress(poolId)) {
      return res.status(400).json({
        error: 'Invalid pool address format'
      });
    }

    const poolInfo = await poolFinder.getPoolInfo(poolId);
    return res.json({
      success: true,
      data: poolInfo
    });

  } catch (error) {
    next(error);
  }
});

// Add error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});