/**
 * Stylized Indonesia archipelago used behind the impact statistics.
 * Simplified silhouette (not survey-accurate) with location pins marking
 * kabupaten/kota tempat Gernas Tastaka menyebar. Design ref: Beranda &
 * Tentang screenshots.
 */

const pins = [
  { x: 12, y: 40, label: "Aceh" },
  { x: 17, y: 46, label: "Sumatera Utara" },
  { x: 22, y: 58, label: "Sumatera Barat" },
  { x: 27, y: 66, label: "Sumatera Selatan" },
  { x: 30, y: 60, label: "Muara Enim" },
  { x: 31, y: 64, label: "Lahat" },
  { x: 33, y: 72, label: "Lampung" },
  { x: 40, y: 74, label: "Banten" },
  { x: 45, y: 76, label: "Jawa Barat" },
  { x: 52, y: 78, label: "Jawa Tengah" },
  { x: 60, y: 79, label: "Jawa Timur" },
  { x: 66, y: 74, label: "Bali" },
  { x: 58, y: 55, label: "Kalimantan" },
  { x: 72, y: 52, label: "Sulawesi" },
  { x: 88, y: 60, label: "Maluku" },
  { x: 95, y: 66, label: "Papua" },
];

const islands = [
  // Sumatra
  "M10,34 C14,30 20,40 24,52 C28,62 30,70 26,74 C21,74 16,60 12,50 C10,44 7,38 10,34 Z",
  // Java
  "M38,73 C46,70 58,72 66,73 C70,74 66,80 58,81 C48,82 40,80 37,78 C35,76 36,74 38,73 Z",
  // Kalimantan
  "M50,42 C58,38 66,42 68,50 C70,58 64,64 56,62 C49,60 46,52 47,47 C48,44 49,43 50,42 Z",
  // Sulawesi
  "M70,44 C74,42 76,48 74,54 C78,52 80,58 76,62 C74,58 71,60 72,55 C69,54 68,48 70,44 Z",
  // Papua
  "M84,52 C92,50 99,56 98,64 C96,70 88,70 84,66 C81,62 80,55 84,52 Z",
  // Nusa Tenggara chain
  "M68,78 C74,77 80,79 84,79 C80,82 72,82 68,80 Z",
];

export function IndonesiaMap() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <svg
        viewBox="0 0 105 90"
        className="h-auto w-full"
        role="img"
        aria-label="Peta sebaran Gernas Tastaka di Indonesia"
      >
        {islands.map((d, i) => (
          <path key={i} d={d} className="fill-brand-blue/85" />
        ))}
        {pins.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="1.9" className="fill-brand-red" />
            <circle cx={p.x} cy={p.y} r="0.7" className="fill-white" />
          </g>
        ))}
      </svg>
    </div>
  );
}
