import React from "react";
import { Navbar } from "./_components/navbar";
import Footer from "./_components/footer";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
