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
import { DASHBOARD_CATALOG_ID } from "@/app/a2ui-dynamic/a2ui/constants";

// A valid example surface, in the exact A2UI v0.9 flat format the renderer
// expects. Pinning a concrete example (and the catalogId) into the prompt is
// what keeps the model from emitting malformed components (e.g. entries
// without an `id`, which throws "Component 'undefined' is missing an 'id'").
const EXAMPLE_COMPONENTS = JSON.stringify([
  { id: "root", component: "Card", child: "col" },
  { id: "col", component: "Column", children: ["title", "metrics", "status"] },
  { id: "title", component: "Text", text: "Dashboard", variant: "h3" },
  {
    id: "metrics",
    component: "Row",
    justify: "spaceBetween",
    children: ["m1", "m2", "m3"],
  },
  { id: "m1", component: "Metric", label: "Revenue", value: "$1.2M" },
  { id: "m2", component: "Metric", label: "Signups", value: "3,402" },
  { id: "m3", component: "Metric", label: "Churn", value: "2.1%" },
  { id: "status", component: "StatusBadge", text: "Healthy", tone: "good" },
]);

const agent = new BuiltInAgent({
  model: determineModel(),
  prompt: [
    "You are a data-viz assistant. When the user asks to see metrics, a",
    "dashboard, or a status report, call the `render_a2ui` tool.",
    "",
    "Call it with these arguments:",
    `- surfaceId: "dashboard-surface"`,
    `- catalogId: "${DASHBOARD_CATALOG_ID}"  (use this EXACT id, do not use the basic_catalog url)`,
    "- components: an A2UI v0.9 flat array (see rules + example below)",
    "",
    "Component format rules (MUST follow exactly):",
    '- Every component is a flat object: { "id": "...", "component": "<Name>", ...props }.',
    '- EVERY component MUST have a unique string "id". The root component MUST have "id": "root".',
    '- "component" is a STRING name, never an object.',
    '- Reference children by id: use "children": ["id1","id2"] for lists, or "child": "id" for a single child. Never inline child objects.',
    "- Available component names: Card, Column, Row, Text (basic) and Metric, StatusBadge, InfoRow (custom).",
    "  Metric props: { label, value }. StatusBadge props: { text, tone: good|warn|bad }. InfoRow props: { label, value }.",
    "",
    `Example components array (adapt the values to the user's request): ${EXAMPLE_COMPONENTS}`,
    "",
    "Invent plausible numbers if the user doesn't give any. Keep your text",
    "reply to one short sentence.",
  ].join("\n"),
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
