import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { StoreProvider } from "@/lib/store";
import { AuthBanner } from "@/components/ui/auth-banner";

const display = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} \u2014 ${site.tagline}`,
    template: `%s \u00B7 ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "AI education",
    "AI for kids",
    "learn AI",
    "machine learning for children",
    "STEM",
    "vibe coding",
    "AI literacy",
    "Somora",
  ],
  authors: [{ name: "Somora" }],
  openGraph: {
    title: `${site.name} \u2014 ${site.tagline}`,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} \u2014 ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#070411",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <StoreProvider>
          {children}
          <AuthBanner />
        </StoreProvider>
      </body>
    </html>
  );
}
