import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import { ListToolsRequestSchema, CallToolRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { getMyIncidents, createIncident } from "./servicenow.js";
import { searchHelp } from "./help.js";
const server = new Server({ name: "servicenow-mcp", version: "1.0.0" }, {
    capabilities: {
        tools: { list: true, call: true },
    },
});
/* Tool list */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "get_my_incidents",
            description: "Get recent ServiceNow incidents",
            inputSchema: { type: "object", properties: {} },
        },
        {
            name: "create_incident",
            description: "Create a ServiceNow incident",
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
            description: "Search ServiceNow help",
            inputSchema: {
                type: "object",
                properties: {
                    query: { type: "string" },
                },
                required: ["query"],
            },
        },
    ],
}));
/* Tool execution */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "get_my_incidents") {
        return { content: [{ type: "text", text: JSON.stringify(await getMyIncidents()) }] };
    }
    if (name === "create_incident") {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await createIncident(args.short_description)),
                },
            ],
        };
    }
    if (name === "search_help") {
        return {
            content: [{ type: "text", text: JSON.stringify(searchHelp(args.query)) }],
        };
    }
    throw new Error("Unknown tool");
});
/* Start HTTP MCP server */
const transport = new HttpServerTransport({
    port: 3333,
    path: "/mcp",
});
await server.connect(transport);
