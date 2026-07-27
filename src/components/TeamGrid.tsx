import Image from "next/image";

/** Satu penggerak, sudah diratakan dari dokumen Payload. */
export type AnggotaTim = {
  nama: string;
  foto?: string;
  peran: string[];
};

/**
 * Grid foto penggerak. Anggota tanpa foto tetap tampil dengan kotak kosong —
 * lebih baik daripada menghilangkan orangnya dari daftar hanya karena
 * fotonya belum diunggah.
 */
export function TeamGrid({ anggota }: { anggota: AnggotaTim[] }) {
  if (anggota.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Daftar penggerak akan segera diperbarui.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {anggota.map((m, i) => (
        <div key={`${m.nama}-${i}`} className="text-center">
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-card bg-surface">
            {m.foto && (
              <Image
                src={m.foto}
                alt={m.nama}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <h4 className="mt-3 text-sm font-bold text-brand-navy">{m.nama}</h4>
          {m.peran.length > 0 && (
            <p className="mt-1 text-xs leading-snug text-muted">
              {m.peran.join(" · ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
