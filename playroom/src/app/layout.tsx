import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rehearsal Room | Rate Hike Coach",
  description:
    "A coach that plays the client, drills you on the conversation, and refuses to let you flinch. For solo consultants raising rates with long-term clients.",
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
