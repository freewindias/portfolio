"use client";

import { Footer as ModemAnimatedFooter } from "@/components/ui/modem-animated-footer";
import Image from "next/image";

export default function Footer() {
  return (
    <ModemAnimatedFooter
      brandName="FreewinDias"
      brandIcon={
        <Image
          src="/logo.jpeg"
          alt="Freewin Dias Logo"
          width={100}
          height={100}
          className="rounded-xl"
        />
      }
    />
  );
}