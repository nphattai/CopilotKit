"use client";

/**
 * Cách 2B — A2UI fixed schema.
 * ----------------------------
 * The component tree is authored by the developer (`a2ui/flight-tree.ts`) and
 * never changes; the agent only fills in DATA via path bindings. The frontend
 * still provides the catalog (definitions + renderers) so the fixed tree has
 * real React components to render into.
 *
 * → You own the layout AND the catalog. The agent supplies data only.
 */

import {
  CopilotChat,
  CopilotKitProvider,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { DemoHeader } from "@/components/demo-header";
import { flightCatalog } from "./a2ui/catalog";

export const dynamic = "force-dynamic";

export default function A2UIFixedDemo() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-a2ui-fixed"
      a2ui={{ catalog: flightCatalog }}
      showDevConsole="auto"
    >
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <DemoHeader
          badge="Cách 2B"
          title="A2UI — fixed schema"
          subtitle="You own the layout. The agent only supplies data."
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
        title: "SFO → JFK",
        message: "Find me a flight from SFO to JFK on United for $289.",
      },
      {
        title: "LHR → NRT",
        message: "Show a flight from London to Tokyo.",
      },
    ],
    available: "always",
  });

  return <CopilotChat threadId="a2ui-fixed" className="h-full" />;
}
