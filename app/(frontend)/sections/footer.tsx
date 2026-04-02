"use client"

import Image from "next/image";
import { Footer as ModemAnimatedFooter } from "@/app/(frontend)/_components/modem-animated-footer";

const Footer = () => {
  return (
    <footer className="-translate-y-px bg-background border-t border-border">
      <ModemAnimatedFooter
        brandName="FreewinDias"
        brandIcon={
          <Image
            src="/logo.jpeg"
            alt="Freewin Dias Logo"
            width={100}
            height={100}
            className="rounded-xl"
            loading="lazy"
            fetchPriority="high"
          />
        }
      />
    </footer>
  );
};

export default Footer;
