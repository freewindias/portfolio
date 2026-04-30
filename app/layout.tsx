import type { Metadata } from "next";
import "./globals.css";
import ReactLenis from "lenis/react";
import Footer from "./sections/footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Freewin Dias | Portfolio",
  description: "Portfolio of Freewin Dias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactLenis root>
        <body className="antialiased">
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </body>
      </ReactLenis>
    </html>
  );
}
