/**
 * Modifies the JSON payload of an SSE string.
 * @param {string} rawSseString - The raw SSE text
 * @param {Function} modifierFn - Callback receiving parsed JSON, returning modified object
 * @returns {string} The reconstructed SSE string
 */
function modifySseData(rawSseString, modifierFn) {
  return rawSseString.replace(/^(data:\s*)(.*)$/m, (match, prefix, jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString.trim());
      const modifiedData = modifierFn(parsedData);
      return prefix + JSON.stringify(modifiedData);
    } catch (e) {
      // Fixed typo: removed the colon from the variable name
      context.setVariable("jsFilterError_1", e.toString());
      return match; 
    }
  });
}

try {
  // 1. Fetch and prep the authorized tools list
  const toolsAuthorizedStr = context.getVariable("verifyapikey.VA-VerifyAPIKey.apiproduct.allowedMCPTools") || "";
  
  // Split by comma, trim whitespace, and filter out any empty strings
  const toolsAuthorized = toolsAuthorizedStr.split(',').map(s => s.trim()).filter(Boolean);

  // 2. Fetch the raw SSE content
  const responseContent = context.getVariable("response.event.current.content");

  if (responseContent) {
    // 3. Use the helper function and apply the filter inside the callback
    const updatedContent = modifySseData(responseContent, (payload) => {
      
      // Ensure the nested structure exists before trying to filter
      if (payload && payload.result && Array.isArray(payload.result.tools)) {
        payload.result.tools = payload.result.tools.filter(tool => 
          toolsAuthorized.includes(tool.name)
        );
      }
      
      return payload; 
    });

    // 4. Write the modified content back to the context
    context.setVariable("response.event.current.content", updatedContent);
  }
} catch (e) {
  // Fixed typo: removed the colon
  context.setVariable("jsFilterError_2", e.toString());
}