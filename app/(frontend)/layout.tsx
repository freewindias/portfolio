import React from "react";
import Footer from "./sections/footer";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <Footer />
    </main>
  );
}
