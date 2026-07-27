import Image from "next/image";

export type FotoGaleri = { url: string; alt: string };

/**
 * Galeri susunan batu bata (masonry) memakai CSS multi-kolom.
 *
 * Dipilih ketimbang grid karena foto dokumentasi kegiatan punya rasio
 * bermacam-macam; grid akan memotongnya, sedangkan kolom membiarkan tiap foto
 * memakai tinggi aslinya.
 */
export function Gallery({
  foto,
  kolom = "4",
}: {
  foto: FotoGaleri[];
  kolom?: string;
}) {
  if (foto.length === 0) return null;

  const kelasKolom =
    { "2": "columns-2", "3": "columns-2 sm:columns-3", "4": "columns-2 sm:columns-3 lg:columns-4" }[
      kolom
    ] ?? "columns-2 sm:columns-3 lg:columns-4";

  return (
    <div className={`${kelasKolom} gap-4 [&>*]:mb-4`}>
      {foto.map((f, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl bg-surface break-inside-avoid"
        >
          <Image
            src={f.url}
            alt={f.alt}
            width={600}
            height={400}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
