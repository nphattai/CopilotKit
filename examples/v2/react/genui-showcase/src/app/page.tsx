import Link from "next/link";

const demos = [
  {
    href: "/frontend-tool",
    badge: "Cách 1",
    title: "Frontend tool + render",
    blurb:
      "The agent calls a tool you registered with useFrontendTool; CopilotKit renders the React component you wrote. You own the component, the agent owns when to call it and with what args.",
    who: "Dev owns the component · Agent picks the tool + args",
  },
  {
    href: "/a2ui-dynamic",
    badge: "Cách 2A",
    title: "A2UI — dynamic schema",
    blurb:
      "The runtime injects a render_a2ui tool. The LLM assembles a whole layout (a JSON component tree) out of your catalog. The agent decides the layout, but only from components you registered.",
    who: "Dev owns the catalog · Agent assembles the layout",
  },
  {
    href: "/a2ui-fixed",
    badge: "Cách 2B-i",
    title: "A2UI fixed — server tool (defineTool)",
    blurb:
      "A server tool (defineTool) returns a fixed, developer-authored component tree and the agent only fills in data via path bindings. The layout is owned by server code, so it can never change.",
    who: "Dev owns the layout (server code) · Agent supplies data only",
  },
  {
    href: "/a2ui-fixed-prompt",
    badge: "Cách 2B-ii",
    title: "A2UI fixed — pinned via render_a2ui",
    blurb:
      "Same fixed flight card, but produced through the standard render_a2ui tool: the exact component tree is pinned into the system prompt and the LLM reuses it verbatim, changing only data. Lower compatibility risk; the 'fix' is prompt-enforced.",
    who: "Dev pins the layout (prompt) · Agent calls render_a2ui",
  },
  {
    href: "/open-gen-ui",
    badge: "Cách 3",
    title: "Open Generative UI",
    blurb:
      "Enable one runtime flag and the agent authors raw HTML/CSS/JS rendered inside a sandboxed iframe. No catalog, no predefined components — fully free-form UI.",
    who: "Agent owns everything (sandboxed)",
  },
];

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "48px 24px 64px",
      }}
    >
      <h1 style={{ fontSize: "1.9rem", fontWeight: 700, margin: 0 }}>
        CopilotKit · Generative UI Showcase
      </h1>
      <p style={{ color: "#52525b", marginTop: 8, lineHeight: 1.6 }}>
        Four ways to render generative UI, ordered from &ldquo;you control the
        pixels&rdquo; to &ldquo;the agent controls the pixels&rdquo;. Every demo
        uses the same{" "}
        <strong>built-in direct-LLM agent</strong> &mdash; no LangGraph, CrewAI,
        or external agent server. Set one provider API key and run.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 16,
          marginTop: 32,
        }}
      >
        {demos.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 14,
              border: "1px solid #e4e4e7",
              textDecoration: "none",
              color: "inherit",
              background: "#fafafa",
              transition: "border-color .15s, background .15s",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6366f1",
              }}
            >
              {d.badge}
            </span>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 650, margin: "6px 0" }}>
              {d.title}
            </h2>
            <p style={{ color: "#52525b", fontSize: "0.9rem", lineHeight: 1.55 }}>
              {d.blurb}
            </p>
            <p
              style={{
                marginTop: 12,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#18181b",
              }}
            >
              {d.who}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
