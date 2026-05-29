/**
 * A2UI catalog DEFINITIONS for the dynamic-schema demo — platform-agnostic.
 *
 * Each entry is a component NAME + a Zod schema for its props. The basic
 * catalog (Card, Column, Row, Text, Button, Divider, …) is mixed in via
 * `includeBasicCatalog: true` in `catalog.ts`, so here we only declare the
 * dashboard-specific components the agent is allowed to use.
 *
 * Path bindings: any prop the agent may bind to the data model (e.g.
 * `{ path: "/revenue" }`) MUST be typed as `string | { path: string }` (the
 * `DynString` union below). The A2UI binder uses that union to detect the
 * field as dynamic and resolve the path at render time. A plain `z.string()`
 * lets the raw `{ path }` object reach React, which throws error #31.
 */
import { z } from "zod";
import type { CatalogDefinitions } from "@copilotkit/a2ui-renderer";

/** Literal string OR a data-model path binding. */
const DynString = z.union([z.string(), z.object({ path: z.string() })]);

export const dashboardDefinitions = {
  Metric: {
    description:
      "A single KPI tile: a small label on top and a large value beneath.",
    props: z.object({
      label: DynString,
      value: DynString,
    }),
  },
  StatusBadge: {
    description:
      "A small colored pill indicating health: tone 'good' (green), 'warn' (amber), or 'bad' (red).",
    props: z.object({
      text: DynString,
      tone: z.enum(["good", "warn", "bad"]).optional(),
    }),
  },
  InfoRow: {
    description: "A label/value pair laid out on one line, label left, value right.",
    props: z.object({
      label: DynString,
      value: DynString,
    }),
  },
} satisfies CatalogDefinitions;

export type DashboardDefinitions = typeof dashboardDefinitions;
