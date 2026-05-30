/**
 * Catalog id for the dynamic-schema dashboard demo. Kept in its own
 * framework-neutral module so the server route can import it (to pin it into
 * the agent prompt) without pulling in the client-only catalog/renderers.
 */
export const DASHBOARD_CATALOG_ID = "copilotkit://genui-dashboard-catalog";
