import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, LOCALES, localizedPath, type Locale } from "./i18n";
import type { NavChild, NavItem } from "./nav";

type RawChild = {
  label?: string | null;
  href?: string | null;
  desc?: string | null;
  hidden?: boolean | null;
};
type RawItem = {
  label?: string | null;
  href?: string | null;
  children?: RawChild[] | null;
  hidden?: boolean | null;
};
type NavigationDoc = { items?: RawItem[] | null };

function toChild(child: RawChild, locale: Locale): NavChild | null {
  if (child.hidden || !child.label || !child.href) return null;
  return {
    label: child.label,
    href: localizedPath(child.href, locale),
    ...(child.desc ? { desc: child.desc } : {}),
  };
}

function toItem(item: RawItem, locale: Locale): NavItem | null {
  if (item.hidden || !item.label) return null;
  const children = (item.children ?? [])
    .map((child) => toChild(child, locale))
    .filter((child): child is NavChild => child !== null);

  return {
    label: item.label,
    ...(item.href ? { href: localizedPath(item.href, locale) } : {}),
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
