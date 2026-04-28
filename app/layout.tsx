import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactLenis from "lenis/react";

import Preloader from "@/components/preloader";

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
          <Preloader />
            {children}
            <Toaster richColors />
        </body>
      </ReactLenis>
    </html>
  );
}
