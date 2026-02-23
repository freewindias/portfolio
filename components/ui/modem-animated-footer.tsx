"use client";
import { cn } from "@/lib/utils";
import {
    NotepadTextDashed
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface FooterProps {
  brandName?: string;
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  brandName = "YourBrand",
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer className="border-t bg-background mt-20 relative">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-80 sm:min-h-72 md:min-h-80 relative p-4 py-10">
          <div className="mt-auto flex flex-col md:items-start items-center justify-center gap-2 pb-0">
            <p className="text-sm text-muted-foreground">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <Link
                href={creatorUrl}
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Crafted by {creatorName}
              </Link>
            )}
          </div>
        </div>

        {/* Large background text - FIXED */}
        <div 
          className="bg-linear-to-b from-foreground/20 via-foreground/10 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-32 md:bottom-28 font-extrabold tracking-tighter pointer-events-none select-none text-center px-4"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            maxWidth: '95vw'
          }}
        >
          {brandName.toUpperCase()}
        </div>

        {/* Bottom logo */}
        <div className="absolute hover:border-foreground duration-400 drop-shadow-[0_0px_20px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0px_20px_rgba(255,255,255,0.3)] bottom-16 md:bottom-14 backdrop-blur-sm rounded-3xl bg-background/60 left-1/2 border-2 border-border flex items-center justify-center p-3 -translate-x-1/2 z-10">
          <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-linear-to-br from-foreground to-foreground/80 rounded-2xl flex items-center justify-center shadow-lg">
            {brandIcon || (
              <NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
            )}
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-22 sm:bottom-26 backdrop-blur-sm h-1 bg-linear-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2"></div>

        {/* Bottom shadow */}
        <div className="bg-linear-to-t from-background via-background/80 blur-[1em] to-background/40 absolute bottom-18 w-full h-24"></div>
      </footer>
    </section>
  );
};
