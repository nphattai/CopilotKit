/**
 * The FIXED, developer-authored A2UI component tree for the flight card.
 *
 * This is the heart of "fixed schema": the layout lives here, in code, and
 * never changes. The agent only provides the DATA (origin, destination,
 * airline, price), which is bound into the tree via `{ path: "/..." }`
 * references against the surface's data model.
 *
 * Framework-neutral (no React / no "use client") so it can be imported from
 * the server route as well as the client catalog.
 */

export const FLIGHT_CATALOG_ID = "copilotkit://genui-flight-catalog";

/** Flat A2UI v0.9 component array. Props are inlined; `child`/`children` compose. */
export const flightComponents = [
  { id: "root", component: "Card", child: "content" },
  {
    id: "content",
    component: "Column",
    children: ["title", "route", "meta"],
  },
  { id: "title", component: "Title", text: "Flight Details" },
  {
    id: "route",
    component: "Row",
    justify: "spaceBetween",
    align: "center",
    children: ["from", "arrow", "to"],
  },
  { id: "from", component: "Airport", code: { path: "/origin" } },
  { id: "arrow", component: "Arrow" },
  { id: "to", component: "Airport", code: { path: "/destination" } },
  {
    id: "meta",
    component: "Row",
    justify: "spaceBetween",
    align: "center",
    children: ["airline", "price"],
  },
  { id: "airline", component: "AirlineBadge", name: { path: "/airline" } },
  { id: "price", component: "PriceTag", amount: { path: "/price" } },
] as const;

export interface FlightData {
  origin: string;
  destination: string;
  airline: string;
  price: string;
}

/**
 * Build the A2UI operations container the A2UI middleware looks for in a tool
 * result. The component tree is FIXED (above); only `data` varies per call.
 *
 * Shape mirrors `buildA2uiOperationsFromToolCall` in
 * showcase/shared/typescript/tools/generate-a2ui.ts.
 */
export function buildFlightSurface(data: FlightData) {
  const surfaceId = "flight-surface";
  return {
    a2ui_operations: [
      { type: "create_surface", surfaceId, catalogId: FLIGHT_CATALOG_ID },
      {
        type: "update_components",
        surfaceId,
        components: flightComponents as unknown as Array<
          Record<string, unknown>
        >,
      },
      { type: "update_data_model", surfaceId, data },
    ],
  };
}
