/**
 * Shared header shown at the top of every demo page: a back-link to the
 * index, the "Cách N" badge, the title, and a one-line subtitle.
 */
export function DemoHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header
      style={{
        padding: "14px 20px",
        borderBottom: "1px solid #e4e4e7",
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <a
        href="/"
        style={{ textDecoration: "none", color: "#6366f1", fontWeight: 700 }}
      >
        ←
      </a>
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#6366f1",
        }}
      >
        {badge}
      </span>
      <strong style={{ fontSize: "1rem" }}>{title}</strong>
      <span style={{ color: "#71717a", fontSize: "0.85rem" }}>{subtitle}</span>
    </header>
  );
}
