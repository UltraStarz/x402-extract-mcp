# Tollkit MCP server

Pay-per-call tools for AI agents, as one remote MCP server:

```
https://api.tollkit.dev/mcp
```

No account and no API key. Each paid tool costs a fixed amount of USDC, paid per call with [x402](https://x402.org) on **Base or Solana**. A call that fails is never charged.

Listed in the official [MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.UltraStarz/x402-extract`.

## Connect

Add the URL above as a remote (Streamable HTTP) MCP server in Claude, Cursor or any MCP client. In clients that take a JSON config:

```json
{
  "mcpServers": {
    "tollkit": { "url": "https://api.tollkit.dev/mcp" }
  }
}
```

**Paying:** MCP has no 402 status, so a paid tool called without its `payment` argument returns the price quote as its result. Sign that quote with your x402 wallet and call the tool again with `payment` set. Six tools are always free: `try_it_free` (a real sample result), `get_service_info`, `find_service`, `check_service`, `check_my_balance` and `verify_attestation`. Fourteen give 3 free calls a day without a payment: `read_page`, `screenshot_page`, `pdf_to_text`, `weather_forecast`, `airport_delays`, `geocode_address`, `exchange_rate`, `ip_lookup`, `wallet_balance`, `token_info`, `transaction_lookup`, `token_price`, `token_check` and `sec_company`.

## Tools

| Group | Tools | Price per call |
|---|---|---|
| Web pages & documents | web search (with date, site and news filters), search + read top pages, read a page or up to 5 at once in a real browser, screenshot, summarize, page brief, PDF to text | $0.002 – $0.008 |
| Public data | SEC filings, financials, company snapshot and due diligence; weather anywhere in the world (by point, or US address); FAA airport delays; US address geocoding; exchange rates; IP lookup | $0.002 – $0.03 |
| On-chain (Base, Ethereum, Solana) | wallet balance and portfolio, token info, token price, token safety check, transaction lookup, pre-trade check | $0.001 – $0.01 |
| x402 market data | best x402 tools for a task, seller lookup, full market dataset | $0.01 – $0.10 |
| Product data | price, stock, brand, SKU and images from a store page; compare up to 5 | $0.01 – $0.04 |
| Proof | signed, timestamped record of what a page said | $0.05 |

Live prices: [`/health`](https://extract.tollkit.dev/health) · every tool with its URL and body: [`llms.txt`](https://api.tollkit.dev/llms.txt) · [tollkit.dev/tools](https://tollkit.dev/tools)

## Without MCP

Every tool is also a plain HTTP endpoint: POST the JSON body, get HTTP 402 with the price, pay with any x402 client (for example `@x402/fetch`), repeat the request. OpenAPI per hostname, e.g. [`https://data.tollkit.dev/openapi.json`](https://data.tollkit.dev/openapi.json).

## This repo

`server.json` is the MCP Registry entry. `src/` holds an older stdio client (the `x402-extract-mcp` npm package) that only wraps product extraction and is no longer maintained; use the remote server above instead.

## More

- [Weekly x402 market report](https://tollkit.dev/report) — free
- [Live sales](https://tollkit.dev/stats) · [Status](https://tollkit.dev/status)
- hello@tollkit.dev · Tollkit LLC

MIT licensed.
