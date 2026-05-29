"use client";

/**
 * Cách 3 — Open Generative UI.
 * ----------------------------
 * The most dynamic option. Enabling `openGenerativeUI` on the runtime is
 * enough — the provider auto-registers the `generateSandboxedUi` tool and the
 * built-in renderer mounts the agent-authored HTML/CSS/JS in a sandboxed
 * iframe. There is NO catalog and NO predefined component: the agent writes
 * the actual markup.
 *
 * `designSkill` (optional) is a prompt injected as agent context to steer the
 * visual style of whatever the agent generates.
 *
 * → The agent owns everything. You trade type-safety for total freedom.
 */

import {
  CopilotChat,
  CopilotKitProvider,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { DemoHeader } from "@/components/demo-header";

export const dynamic = "force-dynamic";

const DESIGN_SKILL = `Produce a polished, self-contained widget.
- Use a clean card: white background, 1px solid #e2e8f0 border, 12px radius, 20px padding.
- Palette: indigo #6366f1 (primary), emerald #10b981 (positive), amber #f59e0b (attention), slate #64748b (neutral text).
- Typography: system-ui; clear title + short subtitle.
- Prefer inline SVG for charts/diagrams over stacks of divs; label axes and series.
- Animate with CSS @keyframes (ease-in-out, loop cyclical concepts); no setInterval.
- The sandbox has no network/storage — keep everything self-running.`;

export default function OpenGenUIDemo() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-open-gen-ui"
      openGenerativeUI={{ designSkill: DESIGN_SKILL }}
      showDevConsole="auto"
    >
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <DemoHeader
          badge="Cách 3"
          title="Open Generative UI"
          subtitle="The agent authors raw HTML/CSS/JS in a sandbox."
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
        title: "Animated bar chart",
        message:
          "Build an animated bar chart of quarterly revenue (Q1–Q4) with labels.",
      },
      {
        title: "Pomodoro timer",
        message: "Make a little Pomodoro timer widget with a circular progress ring.",
      },
    ],
    available: "always",
  });

  return <CopilotChat threadId="open-gen-ui" className="h-full" />;
}
