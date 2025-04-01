import { MCPConfiguration } from "@mastra/mcp";

export const fooMcp = new MCPConfiguration({
    servers: {
        "fetch": {
            "command": "python",
            "args": ["-m", "mcp_server_fetch"]
        }
    }
});