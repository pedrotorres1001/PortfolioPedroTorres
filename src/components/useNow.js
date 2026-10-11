import { useEffect, useState } from "react";

/** Data atual, atualizada a cada `ms`. */
export default function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

/** "2025-10" → { years, months, days } decorridos até `now`. */
export function elapsedSince(yyyymm, now) {
  const [y, m] = yyyymm.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const days = Math.max(0, Math.floor((now - start) / 86400000));
  return { years: Math.floor(months / 12), months: months % 12, totalMonths: months, days };
}

export function formatMonth(yyyymm) {
  const [y, m] = yyyymm.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-GB", { month: "short", year: "numeric" }).toUpperCase();
}
