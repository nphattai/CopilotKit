"use client";

/**
 * Cách 2B (variant ii) — A2UI fixed schema, pinned via render_a2ui.
 * -----------------------------------------------------------------
 * Identical UX to the defineTool variant, but the layout is enforced by the
 * system prompt instead of server code (see the route). It reuses the SAME
 * flight catalog as `/a2ui-fixed`, so the rendered card is the same — only the
 * mechanism that produces it differs.
 *
 * → Lower compatibility risk (official render_a2ui path), but the "fixed" layout
 *   is only as reliable as the model following instructions.
 */

import {
  CopilotChat,
  CopilotKitProvider,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { DemoHeader } from "@/components/demo-header";
import { flightCatalog } from "@/app/a2ui-fixed/a2ui/catalog";

export const dynamic = "force-dynamic";

export default function A2UIFixedPromptDemo() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-a2ui-fixed-prompt"
      a2ui={{ catalog: flightCatalog }}
      showDevConsole="auto"
    >
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <DemoHeader
          badge="Cách 2B-ii"
          title="A2UI fixed — pinned via render_a2ui"
          subtitle="Layout fixed by prompt; LLM calls the standard render_a2ui tool."
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
      { title: "LHR → NRT", message: "Show a flight from London to Tokyo." },
    ],
    available: "always",
  });

  return <CopilotChat threadId="a2ui-fixed-prompt" className="h-full" />;
}
