/**
 * Pick a built-in agent model based on whichever provider API key is present.
 *
 * The built-in agent reads the matching key from the environment automatically
 * (OPENAI_API_KEY / ANTHROPIC_API_KEY / GOOGLE_API_KEY), so all you need to run
 * any demo in this app is ONE of those keys set in `.env.local`.
 */
export function determineModel(): string {
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai/gpt-4o";
  }
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    return "anthropic/claude-sonnet-4.5";
  }
  if (process.env.GOOGLE_API_KEY?.trim()) {
    return "google/gemini-2.5-pro";
  }
  // Fall back to OpenAI; the request will error clearly if no key is set.
  return "openai/gpt-4o";
}
