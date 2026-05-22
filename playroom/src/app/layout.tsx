import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drill. Name. Hold. | The Rate Hike Coach",
  description:
    "A coach for solo consultants raising rates with long-term clients. Plays the client. Names the cope. Refuses to let you flinch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-accent-coach">
        {children}
      </body>
    </html>
  );
}
