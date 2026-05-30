"use client";

/**
 * Dynamic-schema A2UI catalog — wires definitions to renderers.
 *
 * `includeBasicCatalog: true` merges CopilotKit's built-in components
 * (Card, Column, Row, Text, Button, Divider, …) into this catalog, so the
 * agent can compose the custom dashboard components together with layout
 * primitives when it assembles a surface.
 */
import { createCatalog } from "@copilotkit/a2ui-renderer";
import { dashboardDefinitions } from "./definitions";
import { dashboardRenderers } from "./renderers";
import { DASHBOARD_CATALOG_ID } from "./constants";

export { DASHBOARD_CATALOG_ID };

export const dashboardCatalog = createCatalog(
  dashboardDefinitions,
  dashboardRenderers,
  {
    catalogId: DASHBOARD_CATALOG_ID,
    includeBasicCatalog: true,
  },
);
