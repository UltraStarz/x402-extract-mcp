# Tollkit MCP server

Pay-per-call tools for AI agents, as one remote MCP server:

```
https://extract.tollkit.dev/mcp
```

No account and no API key. Each paid tool costs a fixed amount of USDC, paid per call with [x402](https://x402.org) on **Base or Solana**. A call that fails is never charged.

Listed in the official [MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.UltraStarz/x402-extract`.

## Connect

Add the URL above as a remote (Streamable HTTP) MCP server in Claude, Cursor or any MCP client. In clients that take a JSON config:

```json
{
  "mcpServers": {
    "tollkit": { "url": "https://extract.tollkit.dev/mcp" }
  }
}
```

**Paying:** MCP has no 402 status, so a paid tool called without its `payment` argument returns the price quote as its result. Sign that quote with your x402 wallet and call the tool again with `payment` set. Two tools are free: `try_it_free` (a real sample result) and `get_service_info`.

## Tools

| Group | Tools | Price per call |
|---|---|---|
| Web pages & documents | read a page in a real browser, screenshot, summarize, page brief, PDF to text, web search + read top pages | $0.002 – $0.015 |
| Public data | SEC filings, financials, company snapshot and due diligence; US weather (by address or point); FAA airport delays; US address geocoding; exchange rates; IP lookup | $0.002 – $0.03 |
| On-chain (Base, Ethereum, Solana) | wallet balance and portfolio, token info, token price, token safety check, transaction lookup, pre-trade check | $0.002 – $0.01 |
| x402 market data | best x402 tools for a task, seller lookup, full market dataset | $0.01 – $0.10 |
| Product data | price, stock, brand, SKU and images from a store page; compare up to 5 | $0.01 – $0.04 |
| Proof | signed, timestamped record of what a page said | $0.25 |

Live prices: [`/health`](https://extract.tollkit.dev/health) · every tool with its URL and body: [`llms.txt`](https://extract.tollkit.dev/llms.txt) · [tollkit.dev/tools](https://tollkit.dev/tools)

## Without MCP

Every tool is also a plain HTTP endpoint: POST the JSON body, get HTTP 402 with the price, pay with any x402 client (for example `@x402/fetch`), repeat the request. OpenAPI per hostname, e.g. [`https://data.tollkit.dev/openapi.json`](https://data.tollkit.dev/openapi.json).

## This repo

`server.json` is the MCP Registry entry. `src/` holds an older stdio client (the `x402-extract-mcp` npm package) that only wraps product extraction and is no longer maintained; use the remote server above instead.

## More

- [Weekly x402 market report](https://tollkit.dev/report) — free
- [Live sales](https://tollkit.dev/stats) · [Status](https://tollkit.dev/status)
- hello@tollkit.dev · Tollkit LLC

MIT licensed.
