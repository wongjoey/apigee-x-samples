var mcpTool = context.getVariable("mcp.tool");
var authorizedTools = context.getVariable("verifyapikey.VA-VerifyAPIKey.allowedMCPTools").split(/\s*,\s*/);
var isAuthorized = "true";
if (authorizedTools && !authorizedTools.includes(mcpTool)) {
  isAuthorized = "false";
}
context.setVariable("toolAuthorized", isAuthorized);