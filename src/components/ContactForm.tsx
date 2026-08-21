"use client";

import { useState } from "react";
import { contact as fallbackContact } from "@/lib/nav";
import { DEFAULT_LOCALE, uiText, type Locale } from "@/lib/i18n";

type ContactInfo = {
  email: string;
  phone: string;
  address: string;
};

type Status = "idle" | "sending" | "success" | "error";

/** Formulir kontak — mengirim pesan ke koleksi "leads" di Payload. */
export function ContactForm({
  locale = DEFAULT_LOCALE,
  contact = fallbackContact,
}: {
  locale?: Locale;
  contact?: ContactInfo;
}) {
  const text = uiText[locale];
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, locale }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      setF({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fieldDark =
    "w-full min-h-[44px] border-0 border-b border-brand-navy/20 bg-transparent py-2 text-sm text-brand-navy placeholder-muted outline-none focus:border-brand-navy disabled:opacity-60";

  return (
    <div className="grid overflow-hidden rounded-card shadow-card md:grid-cols-[0.9fr_1.1fr]">
      {/* Info panel */}
      <div className="relative bg-brand-navy p-8 text-white sm:p-10">
        <h3 className="text-xl font-bold">{text.contactInfo}</h3>
        <p className="mt-1 text-sm text-white/70">{text.contactTagline}</p>
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
              {text.name} <span className="text-brand-red">*</span>
            </label>
            <input
              id="cf-name"
              name="name"
              autoComplete="name"
              className={fieldDark}
              placeholder={text.namePlaceholder}
              value={f.name}
              onChange={set("name")}
              disabled={status === "sending"}
              required
            />
          </div>
          <div>
            <label htmlFor="cf-phone" className="text-xs font-medium text-muted">
              {text.phone}
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
              disabled={status === "sending"}
            />
          </div>
          <div>
            <label htmlFor="cf-email" className="text-xs font-medium text-muted">
              {text.email} <span className="text-brand-red">*</span>
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
              disabled={status === "sending"}
              required
            />
          </div>
          <div>
            <label htmlFor="cf-subject" className="text-xs font-medium text-muted">
              {text.subject}
            </label>
            <input
              id="cf-subject"
              name="subject"
              autoComplete="off"
              className={fieldDark}
              placeholder={text.subjectPlaceholder}
              value={f.subject}
              onChange={set("subject")}
              disabled={status === "sending"}
            />
          </div>
        </div>
        <div>
          <label htmlFor="cf-message" className="text-xs font-medium text-muted">
            {text.message}
          </label>
          <textarea
            id="cf-message"
            name="message"
            className={`${fieldDark} min-h-[90px] resize-none`}
            placeholder={text.messagePlaceholder}
            value={f.message}
            onChange={set("message")}
            disabled={status === "sending"}
          />
        </div>
        <button type="submit" className="btn-red disabled:opacity-60" disabled={status === "sending"}>
          {status === "sending" ? text.sendingMessage : text.submitMessage}
        </button>
        {status === "success" && (
          <p role="status" className="text-sm text-green-700">
            {text.sendSuccess}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-brand-red">
            {text.sendError}
          </p>
        )}
      </form>
    </div>
  );
}
