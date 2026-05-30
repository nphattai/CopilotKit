/**
 * Cách 3 — Open Generative UI.
 *
 * One runtime flag does it all: `openGenerativeUI: true` makes the runtime
 * apply the OpenGenerativeUIMiddleware to the agent and (on the frontend) the
 * provider auto-registers a `generateSandboxedUi` frontend tool. The agent
 * authors raw HTML/CSS/JS, which the built-in renderer mounts inside a
 * sandboxed iframe. No catalog, no predefined components.
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
    "You are a UI-generating assistant. On every user request, call the",
    "`generateSandboxedUi` tool exactly once to build a self-contained,",
    "visually polished HTML + CSS widget that answers the request. Prefer",
    "inline SVG for any geometric/graphical content and CSS @keyframes for",
    "animation. The sandbox has no network/storage access, so make the widget",
    "self-running. Keep your own chat reply to one short sentence.",
  ].join(" "),
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
  openGenerativeUI: true,
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit-open-gen-ui",
});

export const GET = handle(app);
export const POST = handle(app);
