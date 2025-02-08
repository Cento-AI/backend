/**
 * Cleans an LLM response by removing markdown formatting and code blocks
 * @param response The raw response from the LLM
 * @returns Cleaned response string ready for parsing
 */
export function cleanLLMResponse(response: string): string {
  return response
    .replace(/```json\n?/, '') // Remove JSON code block start
    .replace(/```\n?/, '') // Remove code block end
    .trim(); // Remove extra whitespace
}
