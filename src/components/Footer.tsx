"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getFooterLinks, contact, type NavCta } from "@/lib/nav";
import { splitLocalePath, uiText, type Locale } from "@/lib/i18n";

const socials = [
  { label: "Facebook", href: "#", d: "M13.5 9H15V6.5h-1.5c-1.7 0-2.5 1-2.5 2.6V11H9v2.5h2v6h2.5v-6H15l.5-2.5h-2v-1.2c0-.6.2-.8.8-.8z" },
  { label: "Instagram", href: "#", d: "M12 8.8A3.2 3.2 0 1012 15.2 3.2 3.2 0 0012 8.8zm0 5.3a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zm3.3-5.4a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 7.2c-1.6 0-1.8 0-2.4.03-.6.03-1 .13-1.35.27-.37.14-.68.34-.98.64-.3.3-.5.6-.64.98-.14.35-.24.75-.27 1.35C6.3 11 6.3 11.2 6.3 12s0 1 .03 1.6c.03.6.13 1 .27 1.35.14.37.34.68.64.98.3.3.6.5.98.64.35.14.75.24 1.35.27.6.03.8.03 2.4.03s1.8 0 2.4-.03c.6-.03 1-.13 1.35-.27.37-.14.68-.34.98-.64.3-.3.5-.6.64-.98.14-.35.24-.75.27-1.35.03-.6.03-.8.03-1.6s0-1-.03-1.6c-.03-.6-.13-1-.27-1.35a2.6 2.6 0 00-.64-.98 2.6 2.6 0 00-.98-.64c-.35-.14-.75-.24-1.35-.27C13.8 7.2 13.6 7.2 12 7.2z" },
  { label: "Email", href: `mailto:${contact.email}`, d: "M6 8h12a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1V9a1 1 0 011-1zm0 1.4V15h12V9.4l-6 3.6-6-3.6z" },
  { label: "YouTube", href: "#", d: "M17.5 9.2a1.7 1.7 0 00-1.2-1.2C15.2 7.7 12 7.7 12 7.7s-3.2 0-4.3.3A1.7 1.7 0 006.5 9.2C6.2 10.3 6.2 12 6.2 12s0 1.7.3 2.8a1.7 1.7 0 001.2 1.2c1.1.3 4.3.3 4.3.3s3.2 0 4.3-.3a1.7 1.7 0 001.2-1.2c.3-1.1.3-2.8.3-2.8s0-1.7-.3-2.8zM10.8 13.8v-3.6l3.1 1.8-3.1 1.8z" },
];

export function Footer({ ctaByLocale }: { ctaByLocale: Record<Locale, NavCta | null> }) {
  const pathname = usePathname();
  const { locale } = splitLocalePath(pathname);
  const footerLinks = getFooterLinks(locale);
  const text = uiText[locale];
  const cta = ctaByLocale[locale];
  const aktivitasLinks = cta
    ? [...footerLinks.aktivitas, { label: cta.label, href: cta.href }]
    : footerLinks.aktivitas;

  return (
    <footer className="bg-surface">
      <div className="container-page grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Image
            src="/media/cropped-Logo_GernasTastaka-01-300x124.png"
            alt="Gernas Tastaka"
            width={300}
            height={124}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-muted">{text.footerIntro}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-brand-red">
            Gernas Tastaka
          </h4>
          <ul className="mt-4 space-y-2.5">
            {footerLinks.gernas.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[40px] items-center text-sm text-body hover:text-brand-red"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-brand-red">
            {text.footerActivity}
          </h4>
          <ul className="mt-4 space-y-2.5">
            {aktivitasLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[40px] items-center text-sm text-body hover:text-brand-red"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-brand-red">
            {text.footerContact}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-body">
            <li>{contact.phone}</li>
            <li>
              <a href={`mailto:${contact.emailAlt}`} className="hover:text-brand-red">
                {contact.emailAlt}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-brand-red">
            {text.footerAddress}
          </h4>
          <p className="mt-4 text-sm text-body">{contact.address}</p>
          <div className="mt-4 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-white transition-colors hover:bg-brand-red"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-navy">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-4 text-xs text-white/80 sm:flex-row">
          <p>© {new Date().getFullYear()} Penggerak Indonesia Cerdas</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {text.footerValues.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
