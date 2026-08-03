import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";

/**
 * Visi, Misi & Tata Nilai — teks polos, tanpa kartu berwarna.
 * Sengaja dibuat sesederhana mungkin supaya enak dibaca meski panjang.
 */
export function VisiMisi({
  heading,
  visi,
  misi,
  tataNilai,
  locale,
}: {
  heading?: string;
  visi: string;
  misi: string[];
  tataNilai?: string;
  locale: Locale;
}) {
  const t = uiText[locale];

  return (
    <div className="mx-auto max-w-3xl">
      {heading && (
        <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">{heading}</h2>
      )}

      <div className="mt-8 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-brand-red">{t.visiLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-body sm:text-base">{visi}</p>
        </div>

        {misi.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-brand-red">{t.misiLabel}</h3>
            <ol className="mt-2 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-body sm:text-base">
              {misi.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
          </div>
        )}

        {tataNilai && (
          <div>
            <h3 className="text-lg font-bold text-brand-red">{t.tataNilaiLabel}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body sm:text-base">{tataNilai}</p>
          </div>
        )}
      </div>
    </div>
  );
}
