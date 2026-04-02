import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactLenis from "lenis/react";

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
    <html lang="en">
      <ReactLenis root>
        <body className="antialiased">
          {children}
          <Toaster richColors />
        </body>
      </ReactLenis>
    </html>
  );
}
