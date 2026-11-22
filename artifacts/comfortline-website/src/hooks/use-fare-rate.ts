import { useEffect, useState } from "react";

export interface FareRate {
  date: string;
  bynPerEur: number;
}

// Verified NBRB snapshot for prerendered HTML and temporary service outages.
const snapshot: FareRate = { date: "2026-11-22", bynPerEur: 3.2913 };
let latest = snapshot;

export function useFareRate(enabled = true): FareRate {
  const [rate, setRate] = useState(snapshot);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setRate(latest);
    async function refresh() {
      try {
        const response = await fetch("/api/eur-rate", { signal: controller.signal });
        if (!response.ok) return;
        const data: FareRate = await response.json();
        if (!controller.signal.aborted && /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
            data.date >= latest.date && Number.isFinite(data.bynPerEur) && data.bynPerEur > 0) {
          latest = data;
          setRate(data);
        }
      } catch {
        // The visible date continues to identify the last verified rate.
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 15 * 60_000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [enabled]);
  return rate;
}
