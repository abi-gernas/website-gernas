import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, LOCALES, localizedPath, type Locale } from "./i18n";
import type { NavChild, NavItem } from "./nav";

type RawLink = {
  linkType?: "page" | "custom" | null;
  page?: { slug?: string | null } | number | string | null;
  preset?: string | null;
  custom?: string | null;
};
type RawChild = RawLink & {
  label?: string | null;
  desc?: string | null;
  hidden?: boolean | null;
};
type RawItem = RawLink & {
  label?: string | null;
  children?: RawChild[] | null;
  hidden?: boolean | null;
};
type NavigationDoc = { items?: RawItem[] | null };

/** Jenis Tautan "Halaman CMS" -> slug Pages; "Tautan Kustom" -> Rute Cepat atau teks manual. */
function resolveHref(raw: RawLink): string | null {
  if (raw.linkType === "page") {
    const page = raw.page;
    if (page && typeof page === "object" && page.slug) return `/${page.slug}`;
    return null;
  }
  if (raw.preset && raw.preset !== "__custom__") return raw.preset;
  return raw.custom?.trim() || null;
}

function toChild(child: RawChild, locale: Locale): NavChild | null {
  const href = resolveHref(child);
  if (child.hidden || !child.label || !href) return null;
  return {
    label: child.label,
    href: localizedPath(href, locale),
    ...(child.desc ? { desc: child.desc } : {}),
  };
}

function toItem(item: RawItem, locale: Locale): NavItem | null {
  if (item.hidden || !item.label) return null;
  const href = resolveHref(item);
  const children = (item.children ?? [])
    .map((child) => toChild(child, locale))
    .filter((child): child is NavChild => child !== null);

  return {
    label: item.label,
    ...(href ? { href: localizedPath(href, locale) } : {}),
    ...(children.length ? { children } : {}),
  };
}

/**
 * Menu navbar dari Global "Navigation" di Payload — menggantikan
 * `navByLocale` statis di `src/lib/nav.ts`.
 */
export const getNavigationItems = cache(async function getNavigationItems(
  locale: Locale = DEFAULT_LOCALE,
): Promise<NavItem[]> {
  const payload = await payloadPromise;
  const doc = (await payload.findGlobal({
    slug: "navigation",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    depth: 1, // perlu 1 untuk mengambil slug dari relasi "page"
  })) as NavigationDoc;

  return (doc.items ?? [])
    .map((item) => toItem(item, locale))
    .filter((item): item is NavItem => item !== null);
});

/** Menu untuk semua locale sekaligus — dipakai layout server yang belum tahu locale request. */
export const getNavigationByLocale = cache(async function getNavigationByLocale(): Promise<
  Record<Locale, NavItem[]>
> {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => [locale, await getNavigationItems(locale)] as const),
  );
  return Object.fromEntries(entries) as Record<Locale, NavItem[]>;
});
