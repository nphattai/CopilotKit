"use client";

/**
 * Cách 2A — A2UI dynamic schema.
 * ------------------------------
 * You register a CATALOG (components + Zod schemas + React renderers) and the
 * agent ASSEMBLES a layout from it. The runtime injects a `render_a2ui` tool
 * (see the route) and serialises this catalog's schemas into the agent's
 * context so the LLM knows which components exist.
 *
 * → The agent decides the layout (which components, nested how, with what
 *   data) — but only out of the components you provided. It cannot invent new
 *   component types.
 */

import {
  CopilotChat,
  CopilotKitProvider,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { DemoHeader } from "@/components/demo-header";
import { dashboardCatalog } from "./a2ui/catalog";

export const dynamic = "force-dynamic";

export default function A2UIDynamicDemo() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-a2ui-dynamic"
      a2ui={{ catalog: dashboardCatalog }}
      showDevConsole="auto"
    >
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <DemoHeader
          badge="Cách 2A"
          title="A2UI — dynamic schema"
          subtitle="You own the catalog. The agent assembles the layout."
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <Chat />
        </div>
      </div>
    </CopilotKitProvider>
  );
}

function Chat() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "KPI dashboard",
        message:
          "Show me a KPI dashboard: revenue, signups, churn, plus a status badge.",
      },
      {
        title: "Status report",
        message: "Give me a quick service status report with a few info rows.",
      },
    ],
    available: "always",
  });

  return <CopilotChat threadId="a2ui-dynamic" className="h-full" />;
}
