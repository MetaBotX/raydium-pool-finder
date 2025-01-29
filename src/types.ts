// src/types.ts
export interface TokenPair {
    tokenA: string;
    tokenB: string;
  }
  
  export interface PoolFinderResult {
    poolId: string | null;
    tokenPair: TokenPair;
    timestamp: number;
  }