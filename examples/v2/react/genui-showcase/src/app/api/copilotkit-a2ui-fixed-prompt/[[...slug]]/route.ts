/**
 * Cách 2B (variant ii) — A2UI fixed schema, pinned via `render_a2ui`.
 *
 * Same goal as the defineTool variant (`/a2ui-fixed`): a flight card whose
 * LAYOUT is fixed and whose DATA comes from the agent. But here we don't write
 * a server tool — instead we let the runtime inject the standard `render_a2ui`
 * tool (`injectA2UITool: true`, same plumbing as the dynamic demo) and we
 * "fix" the layout by pinning the exact component tree into the system prompt
 * and instructing the LLM to reuse it verbatim, changing only `data`.
 *
 * Trade-off vs. defineTool:
 *  + Uses the official render_a2ui path → no reliance on tool-result detection.
 *  - The fix is prompt-enforced, so a misbehaving model could deviate from the
 *    layout. Use defineTool when the layout must be guaranteed immutable.
 */
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotEndpoint,
  BuiltInAgent,
} from "@copilotkit/runtime/v2";
import { handle } from "hono/vercel";
import { determineModel } from "@/lib/model";
import {
  flightComponents,
  FLIGHT_CATALOG_ID,
} from "@/app/a2ui-fixed/a2ui/flight-tree";

const FIXED_TREE = JSON.stringify(flightComponents);

const agent = new BuiltInAgent({
  model: determineModel(),
  prompt: [
    "You are a flight-booking assistant that renders a fixed flight card.",
    "When the user asks to find or show a flight, call the `render_a2ui` tool.",
    "You MUST use these exact arguments:",
    `- surfaceId: "flight-surface"`,
    `- catalogId: "${FLIGHT_CATALOG_ID}"`,
    `- components: this EXACT array, copied verbatim (do not add, remove,`,
    `  reorder, or rename anything): ${FIXED_TREE}`,
    "- data: an object with keys origin, destination, airline, price filled",
    "  from the user's request (make up plausible values for anything missing).",
    "The components array is the data-model paths' template; only `data`",
    "should vary between calls. Keep your text reply to one short sentence.",
  ].join("\n"),
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
  // Runtime injects render_a2ui; the LLM calls it with the pinned tree.
  a2ui: { injectA2UITool: true },
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit-a2ui-fixed-prompt",
});

export const GET = handle(app);
export const POST = handle(app);
