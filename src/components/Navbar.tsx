"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavCta, NavItem } from "@/lib/nav";
import {
  DEFAULT_LOCALE,
  LOCALES,
  localeLabel,
  localePathname,
  splitLocalePath,
  uiText,
  type Locale,
} from "@/lib/i18n";
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

/**
 * Benar bila `href` menunjuk halaman yang sedang dibuka (atau halaman di
 * bawahnya, mis. `/video-pembelajaran/slug` untuk `/video-pembelajaran`).
 *
 * Tautan beranda (`/`, `/en`) hanya cocok persis — kalau tidak, semua halaman
 * dianggap "di bawah" beranda. Tautan ber-anchor (`/mitra#hubungi`) diabaikan:
 * ia menunjuk bagian halaman milik menu lain, bukan halaman menu ini.
 */
function cocok(pathname: string, href?: string): boolean {
  if (!href || href.includes("#")) return false;
  const [jalur] = href.split("?");
  const beranda = jalur === "/" || LOCALES.some((l) => jalur === `/${l}`);
  if (beranda) return pathname === jalur;
  return pathname === jalur || pathname.startsWith(`${jalur}/`);
}

/**
 * Label menu utama yang memuat halaman saat ini. Diambil yang pertama cocok,
 * karena satu halaman bisa muncul di dua menu (mis. /mitra di "Kemitraan" dan
 * "Mari Gabung") — menandai keduanya membingungkan.
 */
function menuAktif(items: NavItem[], pathname: string): string | null {
  const item = items.find(
    (it) => cocok(pathname, it.href) || it.children?.some((c) => cocok(pathname, c.href)),
  );
  return item?.label ?? null;
}

function DesktopItem({
  item,
  aktif,
  pathname,
}: {
  item: NavItem;
  aktif: boolean;
  pathname: string;
}) {
  const warna = item.sorot
    ? `rounded-pill text-brand-navy ${
        aktif ? "bg-brand-yellow/60" : "bg-brand-yellow/30"
      } hover:bg-brand-yellow/60 group-hover:bg-brand-yellow/60 group-focus-within:bg-brand-yellow/60`
    : aktif
      ? "text-brand-red"
      : "text-brand-navy/90 hover:text-brand-red group-hover:text-brand-red group-focus-within:text-brand-red";

  if (!item.children) {
    return (
      <Link
        href={item.href!}
        aria-current={cocok(pathname, item.href) ? "page" : undefined}
        className={`px-3 py-2 text-sm font-semibold transition-colors ${warna}`}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${warna}`}
        aria-haspopup="true"
      >
        {item.label}
        <Chevron />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-card">
          {item.children.map((c) => {
            const halamanIni = cocok(pathname, c.href);
            return (
              <Link
                key={c.href}
                href={c.href}
                aria-current={halamanIni ? "page" : undefined}
                className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface ${
                  halamanIni ? "bg-surface" : ""
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    halamanIni ? "text-brand-red" : "text-brand-navy"
                  }`}
                >
                  {c.label}
                </span>
                {c.desc && (
                  <span className="block text-xs text-muted">{c.desc}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LanguageSwitcher({
  locale,
  pathname,
  mobile = false,
  onNavigate,
}: {
  locale: Locale;
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={`flex items-center ${
        mobile ? "justify-center pt-2" : "ml-2"
      } text-xs font-bold uppercase tracking-wide`}
      aria-label="Language"
    >
      {LOCALES.slice()
        .reverse()
        .map((target, index) => (
          <span key={target} className="inline-flex items-center">
            {index > 0 && <span className="mx-1.5 text-muted">|</span>}
            <Link
              href={localePathname(pathname, target)}
              hrefLang={target}
              aria-label={localeLabel(target)}
              aria-current={locale === target ? "true" : undefined}
              onClick={onNavigate}
              className={
                locale === target
                  ? "text-brand-red"
                  : "text-brand-navy/70 transition-colors hover:text-brand-red"
              }
            >
              {target}
            </Link>
          </span>
        ))}
    </div>
  );
}

export function Navbar({
  navByLocale,
}: {
  navByLocale: Record<Locale, { items: NavItem[]; cta: NavCta | null }>;
}) {
  const pathname = usePathname();
  const { locale } = splitLocalePath(pathname);
  const { items: navItems, cta } = navByLocale[locale];
  const text = uiText[locale];
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const homeHref = localePathname("/", locale);
  const aktif = menuAktif(navItems, pathname);

  return (
    <>
      <a href="#main" className="skip-link">
        {text.skipToContent}
      </a>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <nav className="container-page flex h-16 items-center justify-between sm:h-20">
          <Logo
            href={homeHref}
            ariaLabel={`Gernas Tastaka - ${locale === DEFAULT_LOCALE ? "Beranda" : "Home"}`}
          />

          {/* Desktop */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <DesktopItem
                key={item.label}
                item={item}
                aktif={item.label === aktif}
                pathname={pathname}
              />
            ))}
            {cta && (
              <Link href={cta.href} className="btn-red ml-3 !px-5 !py-2.5">
                {cta.label}
              </Link>
            )}
            <LanguageSwitcher locale={locale} pathname={pathname} />
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => {
              // Buka langsung submenu tempat halaman ini berada.
              if (!open) setExpanded(aktif);
              setOpen((v) => !v);
            }}
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg text-brand-navy lg:hidden"
            aria-label={open ? text.closeMenu : text.openMenu}
            aria-expanded={open}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile panel */}
        {open && (
          <div className="border-t border-black/5 bg-white lg:hidden">
            <div className="container-page space-y-1 py-4">
              {navItems.map((item) => {
                const warna = item.sorot
                  ? "-mx-3 rounded-lg bg-brand-yellow/30 px-3 text-brand-navy"
                  : item.label === aktif
                    ? "text-brand-red"
                    : "text-brand-navy";

                return item.children ? (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((e) =>
                          e === item.label ? null : item.label,
                        )
                      }
                      className={`flex min-h-[44px] touch-manipulation items-center justify-between py-2.5 text-sm font-semibold ${
                        // -mx-3 pada menu sorot menarik latarnya keluar gutter; lebarnya ikut ditambah.
                        item.sorot ? "w-[calc(100%+1.5rem)]" : "w-full"
                      } ${warna}`}
                      aria-expanded={expanded === item.label}
                    >
                      {item.label}
                      <Chevron open={expanded === item.label} />
                    </button>
                    {expanded === item.label && (
                      <div className="ml-3 border-l border-black/10 pl-4">
                        {item.children.map((c) => {
                          const halamanIni = cocok(pathname, c.href);
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setOpen(false)}
                              aria-current={halamanIni ? "page" : undefined}
                              className={`flex min-h-[44px] items-center py-2 text-sm ${
                                halamanIni ? "font-semibold text-brand-red" : "text-body"
                              }`}
                            >
                              {c.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setOpen(false)}
                    aria-current={cocok(pathname, item.href) ? "page" : undefined}
                    className={`flex min-h-[44px] items-center py-2.5 text-sm font-semibold ${warna}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {cta && (
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="btn-red mt-3 w-full"
                >
                  {cta.label}
                </Link>
              )}
              <LanguageSwitcher
                locale={locale}
                pathname={pathname}
                mobile
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
