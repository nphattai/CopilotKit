import type { Metadata } from "next";
import "./globals.css";
import "@copilotkit/react-core/v2/styles.css";

export const metadata: Metadata = {
  title: "CopilotKit Generative UI Showcase",
  description:
    "Four ways to render generative UI with CopilotKit v2 and the built-in direct-LLM agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
