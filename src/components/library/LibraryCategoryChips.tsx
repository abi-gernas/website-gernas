import Link from "next/link";

export type LibraryCategoryChip = {
  label: string;
  deskripsi?: string;
  ikon?: string;
  href: string;
};

/**
 * Kartu kategori pintas ("Jelajahi Berdasarkan Kategori" di Alat Peraga,
 * 4 kartu Modul/Buku/Bahan Ajar/LKS di Buku-Bahan Ajar-Modul). Konten beda
 * per halaman, styling sama — lihat §2.3 rencana eksekusi.
 */
export function LibraryCategoryChips({ items }: { items: LibraryCategoryChip[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-2 rounded-card bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          {item.ikon && <span className="text-3xl" aria-hidden="true">{item.ikon}</span>}
          <span className="font-bold text-brand-navy group-hover:text-brand-red">
            {item.label}
          </span>
          {item.deskripsi && <span className="text-sm text-muted">{item.deskripsi}</span>}
        </Link>
      ))}
    </div>
  );
}
