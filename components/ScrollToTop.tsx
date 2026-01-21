"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Prevent browser from restoring scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Scroll to top on pathname change with a tiny delay to ensure render is complete
    const timeoutId = setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname, lenis]);

  return null;
}
