# Generative UI Showcase (CopilotKit v2)

Four ways to render **generative UI** with CopilotKit v2, ordered from "you
control the pixels" to "the agent controls the pixels". Every demo runs on the
**built-in direct-LLM agent** (`BuiltInAgent`) — no LangGraph, CrewAI, or any
external agent server. One provider API key and you're running.

| Route | Approach | Who decides the component? | Who decides the layout? |
| --- | --- | --- | --- |
| `/frontend-tool` | **Cách 1** — Frontend tool + render | You (React) | You |
| `/a2ui-dynamic` | **Cách 2A** — A2UI dynamic schema | You (catalog) | **Agent** (assembles a tree) |
| `/a2ui-fixed` | **Cách 2B-i** — A2UI fixed via `defineTool` | You (catalog) | You (server code); agent supplies data |
| `/a2ui-fixed-prompt` | **Cách 2B-ii** — A2UI fixed via `render_a2ui` | You (catalog) | You (pinned in prompt); agent supplies data |
| `/open-gen-ui` | **Cách 3** — Open Generative UI | **Agent** (raw HTML) | **Agent** |

## Run

```bash
# from the repo root — installs the whole workspace
pnpm install

cp examples/v2/react/genui-showcase/.env.local.example \
   examples/v2/react/genui-showcase/.env.local
# edit .env.local and set ONE of OPENAI_API_KEY / ANTHROPIC_API_KEY / GOOGLE_API_KEY

nx run genui-showcase:dev   # or: cd examples/v2/react/genui-showcase && pnpm dev
```

Open http://localhost:3000 and pick a demo from the landing page.

## Deploy to Vercel (to get a public URL)

This is an Nx + pnpm-workspace monorepo, so Vercel cannot build this app in
isolation — the `@copilotkit/*` workspace packages must be installed and built
first. The included `vercel.json` handles that with the same pattern the repo's
other v2 examples use (it `cd`s to the monorepo root, installs the whole
workspace, then runs `nx run genui-showcase:build`, which builds the dependency
packages via `^build`).

To deploy:

1. Create a Vercel project from this repo and set **Root Directory** to
   `examples/v2/react/genui-showcase`. Vercel reads `vercel.json` from there.
2. Add an environment variable: one of `OPENAI_API_KEY` /
   `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` (required for the agent to respond).
3. Deploy. (No other settings needed — `vercel.json` sets the install/build
   commands and `framework: nextjs`.)

Note: this is a standalone example under `examples/`. It is **not** part of
CopilotKit's hosted `showcase/` registry, so it won't appear there
automatically — you deploy it as its own Vercel project.

## How each approach works

### Cách 1 — Frontend tool + render (`/frontend-tool`)

`useFrontendTool({ name, parameters, render })` registers a tool and a React
`render` function. The agent calls the tool with arguments; CopilotKit maps the
tool name to your component and feeds the (streaming) args in as props. Use the
`status` prop (`InProgress` / `Executing` / `Complete`) to render progressively.

- Server: a plain `BuiltInAgent`. Frontend tools arrive in `input.tools`
  automatically, so nothing special is needed server-side.
- The agent never describes layout — only data.

### Cách 2A — A2UI dynamic schema (`/a2ui-dynamic`)

You register a **catalog** (`createCatalog(definitions, renderers)`): component
names + Zod schemas + React renderers. The runtime is configured with
`a2ui: { enabled: true, injectA2UITool: true }`, which injects a `render_a2ui`
tool into the agent and serialises the catalog schemas into the agent's context.
The LLM then assembles a whole layout (a flat A2UI v0.9 component tree) out of
your catalog — but it can only use components you registered.

- See `a2ui/{definitions,renderers,catalog}.ts`.
- Provider wires the catalog via `a2ui={{ catalog }}`.

### Cách 2B — A2UI fixed schema (two variants)

Same catalog idea as 2A, but the layout is **authored by the developer** in
`a2ui/flight-tree.ts` and never changes — the agent only supplies DATA. There
are two ways to make a built-in agent emit a fixed-layout surface, and this app
ships both so you can compare them:

**2B-i — server tool (`/a2ui-fixed`).** We give the agent a server tool
(`show_flight`, via `defineTool`) whose `execute` returns the fixed component
tree + data as an `a2ui_operations` container. The runtime uses
`a2ui: { injectA2UITool: false }` (our tool owns the surface). The A2UI
middleware detects the container in the tool result and renders it.
The layout lives in server code, so the agent literally cannot change it — but
this path depends on the middleware detecting `a2ui_operations` in a tool
result (see the verification note below).

**2B-ii — pinned via `render_a2ui` (`/a2ui-fixed-prompt`).** We instead let the
runtime inject the standard `render_a2ui` tool (`a2ui: { injectA2UITool: true }`,
same plumbing as 2A) and pin the exact component tree into the system prompt,
instructing the LLM to reuse it verbatim and change only `data`. This rides the
official A2UI path (lower compatibility risk), but the "fix" is prompt-enforced,
so a misbehaving model could deviate from the layout.

Rule of thumb: use **2B-i** when the layout must be guaranteed immutable; use
**2B-ii** when you want the well-trodden `render_a2ui` path and trust the model
to follow the pinned tree.

### Cách 3 — Open Generative UI (`/open-gen-ui`)

Set `openGenerativeUI: true` on the runtime. The provider auto-registers a
`generateSandboxedUi` frontend tool; the agent authors raw HTML/CSS/JS, which
the built-in renderer mounts in a sandboxed iframe. No catalog, no predefined
components — fully free-form. Optionally steer the visual style with
`openGenerativeUI={{ designSkill }}` on the provider. The sandbox has no
network/storage access.

## Note on verification

These examples were written against the v2 APIs as they exist in this repo
(`examples/v2/react/demo` is the reference for `BuiltInAgent` + `a2ui` +
`openGenerativeUI` wiring; the `showcase/` A2UI demos are the reference for the
catalog/definitions/renderers pattern). They have not been run end-to-end here
(that needs an installed workspace and a live LLM key). The A2UI fixed-schema
path in particular depends on the `@ag-ui/a2ui-middleware` version detecting an
`a2ui_operations` container in the tool result; if your middleware version
differs, compare against `showcase/shared/typescript/tools/generate-a2ui.ts`.
