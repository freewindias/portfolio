import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import ReactLenis from "lenis/react";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "sonner";


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
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <ReactLenis root>
          <body className="antialiased">
            <ConvexClientProvider>
              <ScrollToTop />
              {children}
            </ConvexClientProvider>
            <Toaster />
          </body>
        </ReactLenis>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
