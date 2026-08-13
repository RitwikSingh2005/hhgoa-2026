import type { Metadata } from "next";
import { Archivo_Black, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://hhgoa2026-identity.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HH Goa 2026 Builder Identity Generator — Make Your Hackathon PFP & Builder Card",
  description:
    "Turn one photo into your HH Goa 2026 identity. Generate a hackathon profile picture frame or a full Builder Identity Card with your name, role and stack — free, no login, download and share to X.",
  keywords: [
    "HH Goa 2026",
    "Hackathon Goa 2026",
    "Hackathon Goa",
    "HH Goa",
    "Goa hackathon",
    "hackathon profile picture",
    "hackathon PFP",
    "hackathon profile frame",
    "builder identity",
    "developer identity card",
    "hackathon ID card",
    "builder card",
  ],
  authors: [{ name: "HH Goa 2026 community build" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "HH Goa 2026 Builder Identity Generator",
    title: "HH Goa 2026 Builder Identity Generator",
    description:
      "Upload a photo. Ship your HH Goa 2026 builder identity. Download it, share it to X.",
    images: ["/api/og?title=BUILDER%20ONLINE&role=HH%20GOA%202026&id=000000"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 Builder Identity Generator",
    description:
      "Upload a photo. Ship your HH Goa 2026 builder identity. Download it, share it to X.",
    images: ["/api/og?title=BUILDER%20ONLINE&role=HH%20GOA%202026&id=000000"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HH Goa 2026 Builder Identity Generator",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any (browser-based)",
  description:
    "Free browser-based tool to generate an HH Goa 2026 hackathon profile picture frame or Builder Identity Card from a single uploaded photo.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
