"use client";

/**
 * A2UI catalog RENDERERS — React implementations of the components declared
 * in `./definitions`. TypeScript enforces that the keys + prop shapes here
 * match the definitions exactly.
 *
 * The binder resolves `DynString` path bindings to plain strings before
 * calling the renderer, but TypeScript still sees the raw union — so we cast
 * to `Record<string, any>` at the renderer boundary.
 */
import type { CatalogRenderers } from "@copilotkit/a2ui-renderer";
import type { DashboardDefinitions } from "./definitions";

const toneColors: Record<string, { bg: string; fg: string; border: string }> = {
  good: { bg: "rgba(16,185,129,0.12)", fg: "#047857", border: "#10b981" },
  warn: { bg: "rgba(245,158,11,0.12)", fg: "#b45309", border: "#f59e0b" },
  bad: { bg: "rgba(239,68,68,0.12)", fg: "#b91c1c", border: "#ef4444" },
};

export const dashboardRenderers: CatalogRenderers<DashboardDefinitions> = {
  Metric: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          minWidth: 120,
        }}
      >
        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
          {p.label}
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0f172a",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {p.value}
        </div>
      </div>
    );
  },
  StatusBadge: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    const c = toneColors[p.tone ?? "good"] ?? toneColors.good;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 10px",
          borderRadius: 999,
          background: c.bg,
          color: c.fg,
          border: `1px solid ${c.border}`,
          fontSize: "0.74rem",
          fontWeight: 600,
        }}
      >
        {p.text}
      </span>
    );
  },
  InfoRow: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f1f5f9",
          fontSize: "0.9rem",
        }}
      >
        <span style={{ color: "#64748b" }}>{p.label}</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{p.value}</span>
      </div>
    );
  },
};
