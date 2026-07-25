"use client";

import { useEffect, useRef, useState } from "react";

export type Stat = { value: number; suffix?: string; label: string };

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    // If the tab is hidden or motion is reduced, rAF is paused/undesired —
    // snap straight to the final value so the number is never stuck at 0.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (document.hidden || reduce) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Safety net: guarantee the final value even if rAF is throttled.
    const fallback = window.setTimeout(() => setN(target), duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [target, active, duration]);
  return n;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const n = useCountUp(stat.value, active);
  return (
    <div className="flex flex-col items-center rounded-card bg-brand-navy px-4 py-6 text-center text-white shadow-soft">
      <span className="text-3xl font-extrabold tabular-nums sm:text-4xl">
        {n.toLocaleString("id-ID")}
        {stat.suffix}
      </span>
      <span className="mt-2 text-xs font-medium text-white/75 sm:text-sm">
        {stat.label}
      </span>
    </div>
  );
}

export function StatCounterRow({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Direct viewport check — reliable regardless of IntersectionObserver
    // delivery timing (e.g. backgrounded tabs).
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        setActive(true);
        window.removeEventListener("scroll", check);
        return true;
      }
      return false;
    };
    if (check()) return;
    window.addEventListener("scroll", check, { passive: true });
    // Safety: never leave the numbers stuck at 0 if activation is missed.
    const fallback = window.setTimeout(() => setActive(true), 2500);
    return () => {
      window.removeEventListener("scroll", check);
      clearTimeout(fallback);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map((s) => (
        <StatItem key={s.label} stat={s} active={active} />
      ))}
    </div>
  );
}
