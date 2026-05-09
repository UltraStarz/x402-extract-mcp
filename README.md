# x402-extract-mcp

A paid MCP server that gives AI agents structured product data from any URL.

Each `extract_product` tool call:
1. Renders the URL through a headless browser
2. Extracts a `schema.org/Product` JSON blob (name, price, currency, availability, variants, …)
3. Costs **$0.01 USDC** per call, paid automatically from the configured wallet via [x402](https://x402.org)

No API keys. No subscription. The agent pays the toll, gets the data.

## Install in Claude Desktop / Cursor / Windsurf

Add this to your MCP config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "x402-extract": {
      "command": "npx",
      "args": ["-y", "x402-extract-mcp"],
      "env": {
        "BUYER_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY"
      }
    }
  }
}
```

Restart your MCP client. You'll see an `extract_product` tool available.

## What you need

A wallet on **Base Sepolia** (testnet) funded with:

- A small amount of ETH for gas (free from <https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet>)
- USDC for payments (free from <https://faucet.circle.com>, select Base Sepolia)

Generate a throwaway key:

```bash
node -e "const {generatePrivateKey,privateKeyToAccount}=require('viem/accounts');const k=generatePrivateKey();console.log('PRIVATE_KEY=',k);console.log('ADDRESS=',privateKeyToAccount(k).address)"
```

Use the printed address to claim from faucets, then put the printed key into your MCP config.

## Try it

In Claude Desktop, paste a product URL and ask:

> Extract this product page using extract_product: https://stormkeep-odl.bandcamp.com/album/the-nocturnes-of-iswylm-2

You'll get back structured JSON with the product name, price, formats, availability, etc. The on-chain transfer is visible at <https://sepolia.basescan.org>.

## What the response looks like

```json
{
  "product": {
    "name": "The Nocturnes Of Iswylm",
    "description": "...",
    "brand": "Stormkeep",
    "price": 10,
    "currency": "USD",
    "availability": "preorder",
    "variants": [
      { "name": "Format", "values": ["Digital Album", "12\" Vinyl (black)", ...] },
      { "name": "Vinyl Color", "values": ["Black", "Violet", ...] }
    ],
    "images": [],
    "url": "https://..."
  },
  "page": { "title": "...", "status": 200, "render_ms": 2879 },
  "extraction": { "model": "claude-haiku-4-5", "input_tokens": 4479, "output_tokens": 405 }
}
```

## Configuration

| Env var             | Required | Default                                                   |
| ------------------- | -------- | --------------------------------------------------------- |
| `BUYER_PRIVATE_KEY` | yes      | —                                                         |
| `EXTRACT_URL`       | no       | `https://x402-extract-production.up.railway.app/extract`  |

To point the MCP server at your own seller deployment, override `EXTRACT_URL`.

## How it works

```
Claude Desktop ──tool call──> MCP server (this package, on your machine)
                              │
                              │ x402 payment + URL
                              ▼
                              Public seller (Hono + Playwright + Claude on Railway)
                              │
                              │ structured JSON
                              ▼
                              MCP server ──tool result──> Claude Desktop
```

The MCP server doesn't render pages itself. It signs an x402 payment with the buyer's wallet, sends the payment + URL to a public seller endpoint, and returns the seller's response. The seller does the actual headless rendering and Claude-driven schema extraction.

## What works, what doesn't

**Works well:**
- Bandcamp release pages
- Most small/medium Shopify stores
- Tesla Shop product pages
- Any site that doesn't have aggressive anti-bot

**Will return a fetch error** (page status 403/429/no-content):
- Amazon, Walmart, Target, Best Buy
- Most luxury brand sites on Cloudflare
- LinkedIn, Twitter/X (auth wall)

A future version will add residential-proxy support to handle these.

## License

MIT
