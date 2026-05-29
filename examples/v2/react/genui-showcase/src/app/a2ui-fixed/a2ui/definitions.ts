/**
 * A2UI catalog DEFINITIONS for the fixed-schema demo — platform-agnostic.
 *
 * Same idea as the dynamic demo, but here the agent never assembles a layout:
 * the component tree is authored by the developer (see `flight-tree.ts`) and
 * the agent only supplies the DATA. These definitions still declare the
 * component schemas + path-bindable props (`DynString`).
 */
import { z } from "zod";
import type { CatalogDefinitions } from "@copilotkit/a2ui-renderer";

/** Literal string OR a data-model path binding (resolved at render time). */
const DynString = z.union([z.string(), z.object({ path: z.string() })]);

export const flightDefinitions = {
  Title: {
    description: "A prominent heading for the flight card.",
    props: z.object({ text: DynString }),
  },
  Airport: {
    description: "A 3-letter airport code, displayed large.",
    props: z.object({ code: DynString }),
  },
  Arrow: {
    description: "A right-pointing arrow used between airports.",
    props: z.object({}),
  },
  AirlineBadge: {
    description: "A pill-styled airline name tag.",
    props: z.object({ name: DynString }),
  },
  PriceTag: {
    description: "A stylized price display (e.g. '$289').",
    props: z.object({ amount: DynString }),
  },
} satisfies CatalogDefinitions;

export type FlightDefinitions = typeof flightDefinitions;
