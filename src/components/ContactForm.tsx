"use client";

import { useState } from "react";
import { contact } from "@/lib/nav";

/**
 * Contact form — front-end only (Sprint 1). Tidak ada backend submit dalam
 * cakupan PRD ini; aksi mengarahkan ke mailto sebagai fallback aman.
 */
export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Nama: ${f.name}%0D%0ATelepon: ${f.phone}%0D%0A%0D%0A${f.message}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      f.subject || "Pesan dari Website"
    )}&body=${body}`;
  };

  const fieldDark =
    "w-full min-h-[44px] border-0 border-b border-brand-navy/20 bg-transparent py-2 text-sm text-brand-navy placeholder-muted outline-none focus:border-brand-navy";

  return (
    <div className="grid overflow-hidden rounded-card shadow-card md:grid-cols-[0.9fr_1.1fr]">
      {/* Info panel */}
      <div className="relative bg-brand-navy p-8 text-white sm:p-10">
        <h3 className="text-xl font-bold">Contact Information</h3>
        <p className="mt-1 text-sm text-white/70">Yuk Berjejaring!</p>
        <ul className="mt-8 space-y-5 text-sm">
          <li className="flex items-center gap-3">
            <span aria-hidden>📞</span>
            {contact.phone}
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden>✉️</span>
            <a href={`mailto:${contact.email}`} className="hover:underline">
              {contact.email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <span aria-hidden>📍</span>
            {contact.address}
          </li>
        </ul>
        <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-brand-yellow/80" />
        <div className="pointer-events-none absolute bottom-10 right-16 h-16 w-16 rounded-full bg-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 sm:p-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="text-xs font-medium text-muted">
              Nama <span className="text-brand-red">*</span>
            </label>
            <input
              id="cf-name"
              name="name"
              autoComplete="name"
              className={fieldDark}
              placeholder="Tulis nama…"
              value={f.name}
              onChange={set("name")}
              required
            />
          </div>
          <div>
            <label htmlFor="cf-phone" className="text-xs font-medium text-muted">
              Nomor Telepon
            </label>
            <input
              id="cf-phone"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={fieldDark}
              placeholder="+62 …"
              value={f.phone}
              onChange={set("phone")}
            />
          </div>
          <div>
            <label htmlFor="cf-email" className="text-xs font-medium text-muted">
              Email <span className="text-brand-red">*</span>
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              className={fieldDark}
              placeholder="nama@email.com"
              value={f.email}
              onChange={set("email")}
              required
            />
          </div>
          <div>
            <label htmlFor="cf-subject" className="text-xs font-medium text-muted">
              Subjek
            </label>
            <input
              id="cf-subject"
              name="subject"
              autoComplete="off"
              className={fieldDark}
              placeholder="Mis. Kerja sama CSR"
              value={f.subject}
              onChange={set("subject")}
            />
          </div>
        </div>
        <div>
          <label htmlFor="cf-message" className="text-xs font-medium text-muted">
            Pesan
          </label>
          <textarea
            id="cf-message"
            name="message"
            className={`${fieldDark} min-h-[90px] resize-none`}
            placeholder="Tulis pesan…"
            value={f.message}
            onChange={set("message")}
          />
        </div>
        <button type="submit" className="btn-red">
          Kirim Pesan
        </button>
      </form>
    </div>
  );
}
