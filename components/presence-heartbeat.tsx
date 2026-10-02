"use client";

import { useEffect } from "react";

export function PresenceHeartbeat() {
  useEffect(() => {
    const sendHeartbeat = () => {
      if (document.visibilityState === "visible") {
        void fetch("/api/presence", { method: "POST", cache: "no-store" });
      }
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 60_000);
    document.addEventListener("visibilitychange", sendHeartbeat);
    window.addEventListener("focus", sendHeartbeat);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", sendHeartbeat);
      window.removeEventListener("focus", sendHeartbeat);
    };
  }, []);

  return null;
}