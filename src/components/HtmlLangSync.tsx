"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { splitLocalePath } from "@/lib/i18n";

/**
 * `<html lang>` tidak bisa ikut berubah lewat props di layout statis (server
 * root layout dipakai id & en sekaligus, lihat `app/(frontend)/en/`), jadi
 * atribut ini disesuaikan di client segera setelah navigasi.
 */
export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const { locale } = splitLocalePath(pathname);
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
