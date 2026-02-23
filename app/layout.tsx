import ConvexClientProvider from "@/components/ConvexClientProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReactLenis from "lenis/react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";


export const metadata: Metadata = {
  title: "Freewin Dias | Portfolio",
  description: "Portfolio of Freewin Dias.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ConvexAuthNextjsServerProvider>
        <html lang="en">
          <ReactLenis root>
            <body className="antialiased">
              <ConvexClientProvider>
                <ScrollToTop />
                {children}
              </ConvexClientProvider>
              <Toaster />
              <SpeedInsights/>
              <Analytics/>
            </body>
          </ReactLenis>
        </html>
      </ConvexAuthNextjsServerProvider>
    </>
  );
}
