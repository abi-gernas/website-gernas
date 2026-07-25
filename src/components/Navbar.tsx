"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems, type NavItem } from "@/lib/nav";
import { Logo } from "./Logo";

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className="px-3 py-2 text-sm font-semibold text-brand-navy/90 transition-colors hover:text-brand-red"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-brand-navy/90 transition-colors group-hover:text-brand-red group-focus-within:text-brand-red"
        aria-haspopup="true"
      >
        {item.label}
        <Chevron />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-card">
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface"
            >
              <span className="block text-sm font-semibold text-brand-navy">
                {c.label}
              </span>
              {c.desc && (
                <span className="block text-xs text-muted">{c.desc}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between sm:h-20">
        <Logo />

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <DesktopItem key={item.label} item={item} />
          ))}
          <Link href="/donatur" className="btn-red ml-3 !px-5 !py-2.5">
            Donasi
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg text-brand-navy lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setExpanded((e) => (e === item.label ? null : item.label))
                    }
                    className="flex min-h-[44px] w-full items-center justify-between py-2.5 text-sm font-semibold text-brand-navy"
                    aria-expanded={expanded === item.label}
                  >
                    {item.label}
                    <Chevron open={expanded === item.label} />
                  </button>
                  {expanded === item.label && (
                    <div className="ml-3 border-l border-black/10 pl-4">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-[44px] items-center py-2 text-sm text-body"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center py-2.5 text-sm font-semibold text-brand-navy"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link href="/donatur" onClick={() => setOpen(false)} className="btn-red mt-3 w-full">
              Donasi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
