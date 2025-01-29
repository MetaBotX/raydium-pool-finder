// src/pool-finder.ts
import { Connection, PublicKey } from '@solana/web3.js';
import {
  MAINNET_PROGRAM_ID,
  DEVNET_PROGRAM_ID,
  LIQUIDITY_STATE_LAYOUT_V4
} from '@raydium-io/raydium-sdk';
import { TokenPair, PoolFinderResult } from './types';

export class RaydiumPoolFinder {
  private connection: Connection;
  private programId: PublicKey;

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Determine which program ID to use based on NODE_ENV
    const isDevEnvironment = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
    this.programId = isDevEnvironment ? MAINNET_PROGRAM_ID.AmmV4 : DEVNET_PROGRAM_ID.AmmV4;
    
    console.log(`Using ${isDevEnvironment ? 'MAINNET' : 'DEVNET'} Program ID: ${this.programId.toString()}`);
  }

  async findPool(tokenPair: TokenPair): Promise<PoolFinderResult> {
    try {
      const mintA = new PublicKey(tokenPair.tokenA);
      const mintB = new PublicKey(tokenPair.tokenB);

      console.log(`Searching for pool with tokens: ${mintA.toString()} and ${mintB.toString()}`);

      const accounts = await this.connection.getProgramAccounts(
        this.programId,
        {
          filters: [
            {
              dataSize: LIQUIDITY_STATE_LAYOUT_V4.span,
            },
          ],
        }
      );

      console.log(`Found ${accounts.length} total liquidity pools to search through`);

      for (const account of accounts) {
        const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(account.account.data);
        
        if (
          (poolState.baseMint.equals(mintA) && poolState.quoteMint.equals(mintB)) ||
          (poolState.baseMint.equals(mintB) && poolState.quoteMint.equals(mintA))
        ) {
          return {
            poolId: account.pubkey.toString(),
            tokenPair,
            timestamp: Date.now()
          };
        }
      }

      return {
        poolId: null,
        tokenPair,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Error in findPool:', error);
      throw new Error(`Failed to find pool: ${error}`);
    }
  }

  async getPoolInfo(poolId: string) {
    try {
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(poolId));
      if (!accountInfo) {
        throw new Error('Pool account not found');
      }

      const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
      return {
        baseMint: poolState.baseMint.toString(),
        quoteMint: poolState.quoteMint.toString(),
        baseDecimals: poolState.baseDecimal,
        quoteDecimals: poolState.quoteDecimal,
        status: poolState.status,
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }
}