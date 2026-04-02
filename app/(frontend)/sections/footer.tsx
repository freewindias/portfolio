"use client";

import Image from "next/image";
import { Footer as ModemAnimatedFooter } from "@/app/(frontend)/_components/modem-animated-footer";

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
          loading="lazy"
          fetchPriority="high"
        />
      }
    />
  );
}