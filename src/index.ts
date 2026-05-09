#!/usr/bin/env node
// x402-extract-mcp
//
// An MCP server that exposes a paid web-extraction tool to AI agents.
// Each `extract_product` tool call signs a USDC payment from the buyer
// wallet (env BUYER_PRIVATE_KEY) on Base Sepolia and POSTs to the seller
// at EXTRACT_URL (defaults to the public x402-extract instance).
//
// Install in Claude Desktop / Cursor / Windsurf:
//   {
//     "mcpServers": {
//       "x402-extract": {
//         "command": "npx",
//         "args": ["-y", "x402-extract-mcp"],
//         "env": {
//           "BUYER_PRIVATE_KEY": "0x..."
//         }
//       }
//     }
//   }

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { wrapFetchWithPayment } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.BUYER_PRIVATE_KEY as `0x${string}` | undefined;
const EXTRACT_URL =
  process.env.EXTRACT_URL ??
  "https://x402-extract-production.up.railway.app/extract";

if (!PRIVATE_KEY || !PRIVATE_KEY.startsWith("0x")) {
  console.error(
    "x402-extract-mcp: BUYER_PRIVATE_KEY env var is required. " +
      "Set a 0x... key for a wallet funded with Base Sepolia USDC.",
  );
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
const fetchWithPay = wrapFetchWithPayment(fetch, account);

const server = new Server(
  {
    name: "x402-extract",
    version: "0.1.0",
  },
  {
    capabilities: { tools: {} },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "extract_product",
      description:
        "Extract structured Product schema from any product page URL. " +
        "Renders the page through a headless browser, then returns " +
        "name, description, brand, price, currency, availability, " +
        "and variants. Costs $0.01 USDC per call (paid automatically " +
        "from the configured wallet on Base Sepolia). Use this whenever " +
        "the user gives you a product URL and wants the structured fields, " +
        "or when you need clean product data for shopping comparisons, " +
        "price tracking, or catalog ingestion.",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "Absolute https:// URL of the product page to extract.",
          },
        },
        required: ["url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "extract_product") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = request.params.arguments as { url?: string } | undefined;
  const url = args?.url?.trim();

  if (!url) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: "Missing required argument: `url`",
        },
      ],
    };
  }

  try {
    const start = Date.now();
    const res = await fetchWithPay(EXTRACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const body = await res.json();
    const elapsedMs = Date.now() - start;

    if (!res.ok) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              `Extraction failed (HTTP ${res.status}, ${elapsedMs}ms):\n` +
              JSON.stringify(body, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(body, null, 2),
        },
      ],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("x402-extract-mcp tool call failed:", message);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Tool call failed: ${message}`,
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);

console.error(
  `x402-extract-mcp v0.1.0 ready. ` +
    `Buyer: ${account.address} | Target: ${EXTRACT_URL}`,
);
