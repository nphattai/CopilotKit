/**
 * Cách 2B — A2UI fixed schema (with a built-in direct-LLM agent).
 *
 * Unlike the dynamic demo, the layout is NOT authored by the LLM. Instead we
 * give the built-in agent a server tool (`show_flight`) whose only job is to
 * collect flight DATA. Its `execute` returns a fixed, developer-authored
 * component tree + that data as an `a2ui_operations` container (see
 * `flight-tree.ts`). The A2UI middleware (enabled below, with
 * `injectA2UITool: false` because OUR tool owns the surface) detects the
 * container in the tool result and renders it with the frontend catalog.
 *
 * Net effect: the agent supplies data, the developer owns the layout.
 */
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotEndpoint,
  BuiltInAgent,
  defineTool,
} from "@copilotkit/runtime/v2";
import { handle } from "hono/vercel";
import { z } from "zod";
import { determineModel } from "@/lib/model";
import { buildFlightSurface } from "@/app/a2ui-fixed/a2ui/flight-tree";

const showFlight = defineTool({
  name: "show_flight",
  description:
    "Display a flight card to the user. Provide the flight details; the card layout is fixed.",
  parameters: z.object({
    origin: z.string().describe("Origin airport code, e.g. SFO"),
    destination: z.string().describe("Destination airport code, e.g. JFK"),
    airline: z.string().describe("Airline name, e.g. United"),
    price: z.string().describe("Price string including currency, e.g. $289"),
  }),
  // Return the fixed-tree + data container. The A2UI middleware renders it.
  execute: async ({ origin, destination, airline, price }) =>
    buildFlightSurface({ origin, destination, airline, price }),
});

const agent = new BuiltInAgent({
  model: determineModel(),
  prompt: [
    "You are a flight-booking assistant. When the user asks to find or show a",
    "flight, call the `show_flight` tool with the details. Make up plausible",
    "values for anything the user didn't specify. Keep your text reply to one",
    "short sentence — the flight card is the real answer.",
  ].join(" "),
  tools: [showFlight],
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
  // Apply the A2UI middleware, but don't inject render_a2ui — our show_flight
  // tool is the one that emits the surface.
  a2ui: { injectA2UITool: false },
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit-a2ui-fixed",
});

export const GET = handle(app);
export const POST = handle(app);
