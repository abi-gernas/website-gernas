import Link from "next/link";
import { Ikon, type NamaIkon } from "./ikon";

/**
 * Blok `tentangRingkas` — kotak merah "Tentang …" dengan tombol, dan deret
 * fakta berikon di sampingnya (di bawahnya pada layar kecil). Fakta 2 kolom di
 * ponsel, 4 kolom mulai `sm`.
 */
export function TentangRingkas({
  judul,
  isi,
  cta,
  fakta,
}: {
  judul: string;
  isi?: string;
  cta?: { label: string; href: string };
  fakta: { ikon: NamaIkon; teks: string }[];
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div
        className={`grid gap-8 lg:items-center ${
          fakta.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10" : ""
        }`}
      >
        <div className="rounded-card bg-brand-red p-6 text-white shadow-card sm:p-8">
          <h2 className="text-xl font-bold leading-tight [text-wrap:balance] sm:text-2xl">{judul}</h2>
          {isi && <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90">{isi}</p>}
          {cta && (
            <Link
              href={cta.href}
              className="btn group mt-5 border border-white/80 bg-transparent !py-2 !text-xs text-white hover:bg-white hover:text-brand-red"
            >
              {cta.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
          )}
        </div>

        {fakta.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {fakta.map((f, i) => (
              <li key={i} className="flex flex-col items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-red/[0.08] text-brand-red">
                  <Ikon nama={f.ikon} className="h-7 w-7" />
                </span>
                <p className="mt-3 max-w-[12rem] text-sm leading-snug text-body [text-wrap:balance]">{f.teks}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
