import Link from "next/link";

export type ValueCard = {
  title: string;
  body: string;
  tone: "red" | "navy" | "yellow";
  cta?: { label: string; href: string };
  links?: { label: string; href: string }[];
};

const toneClasses: Record<ValueCard["tone"], string> = {
  red: "bg-brand-red text-white",
  navy: "bg-brand-blue text-white",
  yellow: "bg-brand-yellow text-brand-navy",
};

export function ValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <div className="grid gap-0 overflow-hidden rounded-card shadow-card md:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.title}
          className={`flex flex-col p-7 sm:p-8 ${toneClasses[c.tone]}`}
        >
          <h3
            className={`text-lg font-bold ${
              c.tone === "yellow" ? "text-brand-navy" : "text-white"
            }`}
          >
            {c.title}
          </h3>
          <p
            className={`mt-3 flex-1 text-sm leading-relaxed ${
              c.tone === "yellow" ? "text-brand-navy/80" : "text-white/85"
            }`}
          >
            {c.body}
          </p>
          {c.cta && (
            <Link
              href={c.cta.href}
              className={`btn mt-6 self-start ${
                c.tone === "yellow"
                  ? "bg-brand-red text-white hover:bg-brand-red-dark"
                  : "bg-white text-brand-navy hover:bg-white/90"
              }`}
            >
              {c.cta.label}
            </Link>
          )}
          {c.links && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {c.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="btn bg-white/90 !px-4 !py-2 text-brand-navy hover:bg-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
