# Raydium Pool Finder API

A RESTful API service that finds Raydium liquidity pool IDs for given token pairs on Solana. Supports both Mainnet and Devnet environments.

## Features

- Find pool ID for any token pair
- Get detailed pool information
- Support for both Mainnet and Devnet
- Built-in input validation
- Error handling
- Health check endpoint
- TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A Solana RPC endpoint (Mainnet or Devnet)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MetaBotX/raydium-pool-finder.git
cd raydium-pool-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
RPC_ENDPOINT=your_rpc_endpoint
NODE_ENV=development  # or production
```

## Build and Run

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "healthy"
}
```

### Find Pool ID
```
GET /api/pool?tokenA=<token_address>&tokenB=<token_address>
```
Parameters:
- `tokenA`: First token's mint address
- `tokenB`: Second token's mint address

Example:
```bash
curl "http://localhost:3000/api/pool?tokenA=So11111111111111111111111111111111111111112&tokenB=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
```

Success Response:
```json
{
  "success": true,
  "data": {
    "poolId": "pool_address_here",
    "timestamp": 1234567890,
    "tokenPair": {
      "tokenA": "token_a_address",
      "tokenB": "token_b_address"
    }
  }
}
```

### Get Pool Information
```
GET /api/pool/:poolId
```
Parameters:
- `poolId`: The pool address to get information for

Example:
```bash
curl "http://localhost:3000/api/pool/pool_address_here"
```

Success Response:
```json
{
  "success": true,
  "data": {
    "baseMint": "base_token_address",
    "quoteMint": "quote_token_address",
    "baseDecimals": 9,
    "quoteDecimals": 6,
    "status": 1
  }
}
```

## Environment Configuration

The application supports different environments through the `NODE_ENV` variable:

- `development` or `dev`: Uses Raydium's Devnet program ID
- `production` or `prod`: Uses Raydium's Mainnet program ID

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

Error Response Format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Development

### Project Structure
```
/raydium-pool-finder
├── src/
│   ├── server.ts      # Main application file
│   ├── pool-finder.ts # Pool finder implementation
│   ├── types.ts       # Type definitions
│   └── utils.ts       # Utility functions
├── package.json
├── tsconfig.json
└── .env
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Run the built version
- `npm run clean`: Clean the build directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Contact

Your Name - mabbasi_@outlook.com

Project Link: [https://github.com/MetaBotX/raydium-pool-finder](https://github.com/MetaBotX/raydium-pool-finder)