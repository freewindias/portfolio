"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT_MS = 2 * 60 * 1000; // 2 minutes
const SESSION_STORAGE_KEY = "active_session";

export function SessionTimeout() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear flag when not authenticated
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    // Check for active session flag
    const isActiveSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!isActiveSession) {
      // If flag is missing but we are authenticated, it means we are in a new tab
      // or restored session without our specific flag.
      // Force sign-out to enforce "tab close ends session".
      void signOut();
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        void signOut();
      }, INACTIVITY_LIMIT_MS);
    };

    // Initial start
    resetTimer();

    // Event listeners for user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, signOut]);

  return null;
}
