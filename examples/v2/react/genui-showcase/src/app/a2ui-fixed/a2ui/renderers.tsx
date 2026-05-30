"use client";

/**
 * A2UI catalog RENDERERS for the fixed-schema flight card. The binder resolves
 * `{ path }` bindings to plain strings before render; we cast to
 * `Record<string, any>` at the boundary because TypeScript still sees the
 * `DynString` union.
 */
import type { CatalogRenderers } from "@copilotkit/a2ui-renderer";
import type { FlightDefinitions } from "./definitions";

export const flightRenderers: CatalogRenderers<FlightDefinitions> = {
  Title: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <div style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a" }}>
        {p.text}
      </div>
    );
  },
  Airport: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <span
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: "#0f172a",
        }}
      >
        {p.code}
      </span>
    );
  },
  Arrow: () => <span style={{ color: "#94a3b8", fontSize: "1.5rem" }}>→</span>,
  AirlineBadge: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 10px",
          background: "rgba(99,102,241,0.12)",
          color: "#0f172a",
          border: "1px solid #6366f1",
          borderRadius: 999,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {p.name}
      </span>
    );
  },
  PriceTag: ({ props: raw }) => {
    const p = raw as Record<string, any>;
    return (
      <span
        style={{
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "#047857",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {p.amount}
      </span>
    );
  },
};
