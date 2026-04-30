import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactLenis from "lenis/react";

// import Preloader from "@/components/preloader";
import Footer from "./sections/footer";

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
          {/* <Preloader /> */}
          <main>
            {children}
            <Footer />
          </main>
          <Toaster richColors />
        </body>
      </ReactLenis>
    </html>
  );
}
