import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { getMyIncidents, createIncident } from "./servicenow.js";
import { searchHelp } from "./help.js";
/* ------------------------------------------------------------------ */
/* Create MCP Server                                                   */
/* ------------------------------------------------------------------ */
const server = new Server({
    name: "servicenow-mcp",
    version: "1.0.0",
}, {
    /**
     * IMPORTANT:
     * Claude Desktop REQUIRES explicit tool capabilities.
     * The SDK typings lag behind the protocol, so we cast safely.
     */
    capabilities: {
        tools: {
            list: true,
            call: true,
        },
    },
});
/* ------------------------------------------------------------------ */
/* List available tools                                                */
/* ------------------------------------------------------------------ */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_my_incidents",
                description: "Get recent ServiceNow incidents",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "create_incident",
                description: "Create a new ServiceNow incident",
                inputSchema: {
                    type: "object",
                    properties: {
                        short_description: { type: "string" },
                    },
                    required: ["short_description"],
                },
            },
            {
                name: "search_help",
                description: "Search basic ServiceNow help",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" },
                    },
                    required: ["query"],
                },
            },
        ],
    };
});
/* ------------------------------------------------------------------ */
/* Handle tool calls                                                   */
/* ------------------------------------------------------------------ */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "get_my_incidents") {
        const data = await getMyIncidents();
        return {
            content: [{ type: "text", text: JSON.stringify(data) }],
        };
    }
    if (name === "create_incident") {
        const { short_description } = args;
        const data = await createIncident(short_description);
        return {
            content: [{ type: "text", text: JSON.stringify(data) }],
        };
    }
    if (name === "search_help") {
        const { query } = args;
        const data = searchHelp(query);
        return {
            content: [{ type: "text", text: JSON.stringify(data) }],
        };
    }
    throw new Error(`Unknown tool: ${name}`);
});
/* ------------------------------------------------------------------ */
/* Start server over STDIO                                             */
/* ------------------------------------------------------------------ */
const transport = new StdioServerTransport();
await server.connect(transport);
/**
 * 🚨 CRITICAL FOR CLAUDE DESKTOP 🚨
 *
 * Claude requires the MCP process to STAY ALIVE.
 * If the event loop exits, Claude disconnects.
 */
await new Promise(() => { });
