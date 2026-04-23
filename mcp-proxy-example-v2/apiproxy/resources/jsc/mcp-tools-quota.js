// 1. Fetch the tool name and quota configurations
const mcpTool = context.getVariable("mcp.tool");
const quotasStr = context.getVariable("verifyapikey.VA-VerifyAPIKey.apiproduct.mcpToolQuotas") || "";
const clientId = context.getVariable("verifyapikey.VA-VerifyAPIKey.client_id");

// 2. Default values (if no quota is found for the tool, maybe we don't enforce)
var limit = "0"; // Using 0 or a very high number to mean "no quota" or "unlimited"
var interval = "1";
var timeunit = "month";
var enforce = "disabled";

if (mcpTool && quotasStr) {
  // 3. Split by comma to get individual tool configs
  const toolQuotas = quotasStr.split(',').map(s => s.trim()).filter(Boolean);
  
  for (var i = 0; i < toolQuotas.length; i++) {
    const parts = toolQuotas[i].split(':'); // tool_name:limit:interval:timeunit
    if (parts[0] === mcpTool && parts.length >= 2) {
      limit = parts[1];
      interval = parts[2] || "1";
      timeunit = parts[3] || "hour";
      enforce = "enabled";
      break;
    }
  }
}

// 4. Set context variables for the Quota policy
context.setVariable("mcp.toolquotalimit", limit);
context.setVariable("mcp.toolquotainterval", interval);
context.setVariable("mcp.toolquotatimeunit", timeunit);
context.setVariable("mcp.toolquotaid", clientId + ":" + mcpTool);
context.setVariable("mcp.toolquotaenforce", enforce);