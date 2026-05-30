"use client";

/**
 * Cách 1 — Frontend tool + render.
 * --------------------------------
 * The simplest form of generative UI. You register a tool with
 * `useFrontendTool`, give it a `render` function, and the agent decides when
 * to call it and with what arguments. CopilotKit maps the tool name to your
 * React component and feeds the (streaming) args in as props.
 *
 * - `status` lets you render progressively: a skeleton while the args stream
 *   in (`InProgress`), then the full card once they're complete.
 * - The component is 100% yours — the agent never describes layout, only data.
 */

import {
  CopilotChat,
  CopilotKitProvider,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { ToolCallStatus } from "@copilotkit/core";
import { z } from "zod";
import { DemoHeader } from "@/components/demo-header";

export const dynamic = "force-dynamic";

export default function FrontendToolDemo() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-frontend-tool"
      showDevConsole="auto"
    >
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <DemoHeader
          badge="Cách 1"
          title="Frontend tool + render"
          subtitle="You write the component. The agent picks the tool + args."
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <Chat />
        </div>
      </div>
    </CopilotKitProvider>
  );
}

function Chat() {
  // The weather tool: the agent calls it, CopilotKit renders <WeatherCard/>.
  useFrontendTool({
    name: "showWeather",
    description: "Display a weather forecast card for a location.",
    parameters: z.object({
      location: z.string().describe("City / place name"),
      temperatureC: z.number().describe("Temperature in Celsius"),
      condition: z
        .enum(["sunny", "cloudy", "rainy", "snowy"])
        .describe("Sky condition"),
      summary: z.string().describe("One short human-readable summary"),
    }),
    // The tool's purpose is to render UI. We still return a short string so the
    // tool call resolves cleanly and the agent can follow up in text.
    handler: async ({ location }) => `Displayed the weather card for ${location}.`,
    render: ({ status, args }) => {
      // While args stream in we may only have a partial object.
      if (status === ToolCallStatus.InProgress) {
        return <WeatherCard loading location={args.location} />;
      }
      return (
        <WeatherCard
          location={args.location ?? ""}
          temperatureC={args.temperatureC}
          condition={args.condition}
          summary={args.summary}
        />
      );
    },
  });

  useConfigureSuggestions({
    suggestions: [
      { title: "Weather in Tokyo", message: "What's the weather in Tokyo?" },
      { title: "Weather in Reykjavík", message: "How's Reykjavík looking?" },
    ],
    available: "always",
  });

  return <CopilotChat threadId="frontend-tool" className="h-full" />;
}

const ICONS: Record<string, string> = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
};

function WeatherCard({
  location,
  temperatureC,
  condition,
  summary,
  loading,
}: {
  location?: string;
  temperatureC?: number;
  condition?: "sunny" | "cloudy" | "rainy" | "snowy";
  summary?: string;
  loading?: boolean;
}) {
  return (
    <div
      style={{
        margin: "8px 0",
        padding: 18,
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg,#eef2ff,#ffffff)",
        maxWidth: 320,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
            {location || "…"}
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a" }}>
            {temperatureC != null ? `${temperatureC}°C` : "—"}
          </div>
        </div>
        <div style={{ fontSize: "2.4rem" }}>
          {condition ? ICONS[condition] : "⏳"}
        </div>
      </div>
      <div style={{ marginTop: 8, color: "#475569", fontSize: "0.9rem" }}>
        {loading ? "Fetching forecast…" : summary}
      </div>
    </div>
  );
}
