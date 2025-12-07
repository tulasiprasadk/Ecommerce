"use client";
import { useEffect } from "react";

export default function AnalyticsClient() {
  useEffect(() => {
    const type = "page_view";
    const meta = { path: window.location.pathname };
    fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, meta }) });
  }, []);
  return null;
}

