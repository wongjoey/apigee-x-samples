// 1. Fetch variables safely, defaulting to an empty string to prevent null errors
const mcpTool = context.getVariable("mcp.tool");
const allowedToolsStr = context.getVariable("verifyapikey.VA-VerifyAPIKey.apiproduct.allowedMCPTools") || "";

// 2. Cleanly split the string into an array
// Using .split(',') combined with .map and .filter handles trailing commas and spaces perfectly
const authorizedTools = allowedToolsStr
  .split(',')
  .map(tool => tool.trim())
  .filter(Boolean);

// 3. Directly evaluate the boolean logic and convert it to the string "true" or "false"
const isAuthorized = authorizedTools.includes(mcpTool) ? "true" : "false";

// 4. Set the context variable
context.setVariable("toolAuthorized", isAuthorized);