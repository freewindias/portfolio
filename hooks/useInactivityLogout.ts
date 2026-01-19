"use client";

import { useEffect, useRef } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 2 minutes in milliseconds

/**
 * Hook that monitors user activity and automatically logs out after 5 minutes of inactivity.
 * Activity is defined as: mouse movement, keyboard input, clicks, scrolls, or touch events.
 */
export function useInactivityLogout() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    const resetTimer = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        void signOut().then(() => {
          router.push("/");
        });
      }, INACTIVITY_TIMEOUT);
    };

    // Activity events to monitor
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, signOut, router]);
}
