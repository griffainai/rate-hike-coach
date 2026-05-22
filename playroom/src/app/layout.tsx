import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://rate-hike-coach.vercel.app";
const TITLE = "Drill. Name. Hold. | The Rate Hike Coach";
const DESCRIPTION =
  "A coach for solo consultants who freeze on the rate-hike conversation. Plays the client. Names the cope. Refuses to let you flinch. Built on Interpretable Context Methodology — folder + app, same coach.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "AI coach",
    "rate hike",
    "consulting",
    "pricing coach",
    "Interpretable Context Methodology",
    "ICM",
    "EDUBA",
    "Cleaf Notes",
    "Claude",
    "Anthropic",
  ],
  authors: [{ name: "griffainai" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "The Rate Hike Coach",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-wine-deep font-sans">
        {children}
      </body>
    </html>
  );
}
