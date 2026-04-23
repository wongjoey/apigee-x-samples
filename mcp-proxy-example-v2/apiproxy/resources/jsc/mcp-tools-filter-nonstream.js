try {
  // 1. Fetch and prep the authorized tools list
  const toolsAuthorizedStr = context.getVariable("verifyapikey.VA-VerifyAPIKey.apiproduct.allowedMCPTools") || "";
  
  // Split by comma, trim whitespace, and filter out any empty strings
  const toolsAuthorized = toolsAuthorizedStr.split(',').map(s => s.trim()).filter(Boolean);

  // 2. Fetch the raw JSON content from the response
  // Note: For non-streaming responses, the variable is usually just 'response.content'
  const responseContent = context.getVariable("response.content");

  if (responseContent) {
    // 3. Parse the standard JSON payload
    const payload = JSON.parse(responseContent);

    // 4. Filter the tools array if it exists
    if (payload && payload.result && Array.isArray(payload.result.tools)) {
      payload.result.tools = payload.result.tools.filter(tool => 
        toolsAuthorized.includes(tool.name)
      );
    }

    // 5. Stringify the modified object and write it back to the context
    context.setVariable("response.content", JSON.stringify(payload));
  }
} catch (e) {
  // Safely catch any JSON parsing errors or unexpected missing properties
  context.setVariable("jsFilterError_PlainJson", e.toString());
}