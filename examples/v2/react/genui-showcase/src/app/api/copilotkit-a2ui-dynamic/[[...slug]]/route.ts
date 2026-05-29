/**
 * Cách 2A — A2UI dynamic schema.
 *
 * `a2ui: { enabled: true, injectA2UITool: true }` makes the runtime inject a
 * `render_a2ui` tool into the built-in agent's toolset and serialise the
 * frontend catalog's component schemas into the agent's context. The LLM then
 * calls `render_a2ui` with a component tree (a flat A2UI v0.9 array) assembled
 * from the catalog. The A2UI middleware turns that tool call into a surface
 * the frontend renders with your React renderers.
 *
 * Nothing about the layout is hard-coded here: the agent decides the whole
 * tree — it is just constrained to the components you registered.
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
    "You are a data-viz assistant. When the user asks to see metrics, a",
    "dashboard, or a status report, call the `render_a2ui` tool to build a",
    "surface from the available catalog components (Metric, StatusBadge,",
    "InfoRow plus the basic layout components like Card, Column, Row, Text).",
    "Compose a clean layout — group metrics in a Row, wrap everything in a",
    "Card. Invent plausible numbers if the user doesn't give any.",
  ].join(" "),
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
  // injectA2UITool: true → the runtime owns the render_a2ui tool.
  a2ui: { injectA2UITool: true },
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit-a2ui-dynamic",
});

export const GET = handle(app);
export const POST = handle(app);
