# MCP Excalidraw Integration Setup

This document describes the setup and usage of the MCP Excalidraw integration for the Food Security MA project. This integration allows Claude to create and manipulate diagrams in Excalidraw through the Model Context Protocol (MCP).

## What is MCP Excalidraw?

MCP Excalidraw is a TypeScript-based system that combines Excalidraw's powerful drawing capabilities with the Model Context Protocol. It enables AI agents like Claude to:

- Create and manipulate diagrams on a live canvas in real-time
- Generate visual diagrams from text descriptions
- Convert Mermaid diagrams to Excalidraw elements
- Synchronize changes across multiple connected clients via WebSocket

## Components

The system consists of two main components:

1. **Canvas Server**: Provides the web-based Excalidraw interface (runs on http://localhost:3000)
2. **MCP Server**: Allows Claude to interact with the canvas through MCP tools

## Installation Status

✅ **Completed**: The MCP Excalidraw repository has been cloned and built in the `mcp_excalidraw/` directory.

## Configuration

The MCP server is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/home/user/Food_Security_MA/mcp_excalidraw/dist/index.js"],
      "env": {
        "EXPRESS_SERVER_URL": "http://localhost:3000",
        "ENABLE_CANVAS_SYNC": "true"
      }
    }
  }
}
```

## Usage

### Starting the Canvas Server

Before using the MCP tools, you need to start the canvas server:

```bash
cd mcp_excalidraw
npm run canvas
```

This will start the Excalidraw canvas interface on http://localhost:3000. Open this URL in your browser to view the live canvas.

### Using Claude to Create Diagrams

Once the canvas server is running and the MCP server is configured, you can ask Claude to create diagrams. For example:

- "Create a flowchart showing the data flow in our food security application"
- "Draw a system architecture diagram with database, API, and frontend components"
- "Convert this Mermaid diagram to Excalidraw: [mermaid code]"

### Available MCP Tools

The Excalidraw MCP server provides the following capabilities:

- **Create Elements**: rectangles, ellipses, diamonds, arrows, text, lines
- **Update Elements**: Modify existing diagram elements
- **Delete Elements**: Remove elements from the canvas
- **Query Elements**: Filter and find specific elements
- **Group & Align**: Organize elements with grouping, alignment, and distribution
- **Lock Elements**: Protect elements from accidental modification
- **Mermaid Conversion**: Convert Mermaid diagrams to Excalidraw format

## Docker Alternative

If you prefer to use Docker for the canvas server:

```bash
docker pull ghcr.io/yctimlin/mcp_excalidraw-canvas:latest
docker run -d -p 3000:3000 --name mcp-excalidraw-canvas ghcr.io/yctimlin/mcp_excalidraw-canvas:latest
```

Then update `.mcp.json` to use the Docker container for the MCP server if needed.

## Benefits for This Project

For the Food Security MA project, this integration enables:

- Visual documentation of system architecture
- Quick prototyping of UI/UX flows
- Data flow diagrams for the enrichment and verification system
- Collaborative diagram editing during planning sessions
- Automatic generation of documentation diagrams

## Troubleshooting

### Canvas Server Won't Start
- Ensure port 3000 is not already in use
- Check that all dependencies were installed correctly

### MCP Tools Not Available
- Verify that Claude Code has loaded the `.mcp.json` configuration
- Restart Claude Code if needed
- Ensure the canvas server is running

### Elements Not Appearing on Canvas
- Check that `ENABLE_CANVAS_SYNC` is set to `"true"` in `.mcp.json`
- Verify the `EXPRESS_SERVER_URL` points to the correct canvas server address
- Refresh the browser page showing the canvas

## Repository

Original repository: https://github.com/yctimlin/mcp_excalidraw
