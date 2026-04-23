// const responseContent = context.getVariable("response.content");
// context.setVariable("flattenedStructuredContent",JSON.stringify(responseContent));

try {
    // 1. Get the current response body from the Apigee context
    var responseContent = context.getVariable("response.content");
    
    if (responseContent) {
        // 2. Parse the stringified JSON into an object
        var payload = JSON.parse(responseContent);

        // 3. Check if both required fields exist
        if (payload.result.structuredContent && payload.result.content && payload.result.content[0]) {
            
            // 4. Stringify the structuredContent and overwrite the text field
            // We use no indentation (null) to keep the payload size smaller for the proxy
            payload.result.content[0].text = JSON.stringify(payload.result.structuredContent);
            
            // 5. Update the response body with the modified object
            context.setVariable("response.content", JSON.stringify(payload));
        }
        context.setVariable("flattenedStructuredContent",JSON.stringify(responseContent));
    }
} catch (e) {
    // Optional: Log error to a variable for debugging in Trace
    context.setVariable("js_policy_error", e.toString());
}