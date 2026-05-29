"use client";

/**
 * Fixed-schema A2UI catalog — wires the flight definitions to renderers.
 * `includeBasicCatalog: true` brings in Card / Column / Row / Text so the
 * fixed tree in `flight-tree.ts` can use them as layout primitives.
 */
import { createCatalog } from "@copilotkit/a2ui-renderer";
import { flightDefinitions } from "./definitions";
import { flightRenderers } from "./renderers";
import { FLIGHT_CATALOG_ID } from "./flight-tree";

export { FLIGHT_CATALOG_ID };

export const flightCatalog = createCatalog(flightDefinitions, flightRenderers, {
  catalogId: FLIGHT_CATALOG_ID,
  includeBasicCatalog: true,
});
