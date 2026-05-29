/**
 * Cách 1 — Frontend tool + render.
 *
 * The built-in agent needs no special configuration here: frontend tools
 * registered with `useFrontendTool` on the client arrive in the request as
 * `input.tools`, so the LLM can call them by name. The matching React
 * `render` function (registered alongside the tool) draws the component in
 * the chat. The server side is just a plain built-in agent.
 */
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotEndpoint,
  BuiltInAgent,
} from "@copilotkit/runtime/v2";
import { handle } from "hono/vercel";
import { determineModel } from "@/lib/model";

const agent = new BuiltInAgent({
  model: determineModel(),
  prompt: [
    "You are a friendly weather assistant.",
    "When the user asks about the weather in a place, call the `showWeather`",
    "tool with a plausible (made-up is fine) forecast for that place.",
    "Keep your own text reply to one short sentence — the weather card is the",
    "real answer.",
  ].join(" "),
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit-frontend-tool",
});

export const GET = handle(app);
export const POST = handle(app);
