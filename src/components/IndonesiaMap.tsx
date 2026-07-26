import Image from "next/image";

/**
 * Peta sebaran Gernas Tastaka di Indonesia.
 *
 * Latar: ilustrasi 3D clay seluruh kepulauan (public/media/peta-indonesia-clay.jpeg,
 * 1376×768). Overlay pin digambar sebagai SVG dengan viewBox yang sama persis
 * dengan piksel gambar, sehingga koordinat `x`/`y` di bawah = koordinat piksel
 * pada gambar tersebut dan ikut menskala bersama gambar.
 *
 * `lx`/`ly` adalah posisi baseline teks label; sengaja disebar manual agar tidak
 * saling tabrakan di area padat (Jawa). Garis penghubung tipis digambar otomatis
 * bila label cukup jauh dari pin-nya.
 *
 * Ganti `type: "tastaba"` pada kota yang merupakan program Gernas Tastaba
 * (membaca) — pin & legenda dua warna otomatis muncul begitu ada minimal satu.
 *
 * Kota bertanda `tastaba` di bawah diambil dari peta referensi 2D (pin navy),
 * hasil sampling warna 44 pin di gambar itu: 5 navy — 1 di Sumsel, 3 di klaster
 * Jakarta, 1 di klaster Rembang/Blora. Peta referensi tidak punya garis penunjuk
 * label, jadi dua di antaranya hasil pencocokan posisi dan belum terkonfirmasi:
 * "Depok" (bisa jadi Bandung) dan "Rembang" (bisa jadi Blora). Muara Enim,
 * Jakarta, dan Bogor sudah pasti.
 */

const MAP_W = 1376;
const MAP_H = 768;

type Pin = {
  label: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor?: "start" | "middle" | "end";
  type?: "tastaka" | "tastaba";
};

const pins: Pin[] = [
  // Sumatra
  { label: "Sigli", x: 85, y: 127, lx: 103, ly: 108, anchor: "start" },
  { label: "Deli Serdang", x: 195, y: 195, lx: 213, ly: 176, anchor: "start" },
  { label: "Batam", x: 310, y: 252, lx: 328, ly: 233, anchor: "start" },
  { label: "Palembang", x: 314, y: 331, lx: 314, ly: 293 },
  { label: "Pali", x: 306, y: 344, lx: 342, ly: 325, anchor: "start" },
  { label: "Muara Enim", x: 298, y: 353, lx: 262, ly: 334, anchor: "end", type: "tastaba" },
  { label: "Lahat", x: 288, y: 358, lx: 266, ly: 362, anchor: "end" },
  { label: "Belitung Timur", x: 397, y: 363, lx: 490, ly: 392 },
  { label: "Bandar Lampung", x: 297, y: 420, lx: 279, ly: 401, anchor: "end" },

  // Jawa
  { label: "Lebak", x: 325, y: 457, lx: 325, ly: 555 },
  { label: "Jakarta", x: 348, y: 442, lx: 348, ly: 384, type: "tastaba" },
  { label: "Bogor", x: 346, y: 456, lx: 346, ly: 494, type: "tastaba" },
  { label: "Depok", x: 347, y: 450, lx: 347, ly: 528, type: "tastaba" },
  { label: "Bandung", x: 368, y: 467, lx: 368, ly: 585 },
  { label: "Cirebon", x: 393, y: 458, lx: 393, ly: 420 },
  { label: "Brebes", x: 407, y: 462, lx: 407, ly: 384 },
  { label: "Bantul", x: 442, y: 500, lx: 442, ly: 538 },
  { label: "Klaten", x: 449, y: 496, lx: 449, ly: 574 },
  { label: "Rembang", x: 469, y: 479, lx: 469, ly: 441, type: "tastaba" },
  { label: "Blora", x: 471, y: 492, lx: 493, ly: 566, anchor: "start" },
  { label: "Jombang", x: 493, y: 503, lx: 493, ly: 601 },
  { label: "Lamongan", x: 498, y: 492, lx: 498, ly: 414 },
  { label: "Surabaya", x: 507, y: 492, lx: 529, ly: 438, anchor: "start" },
  { label: "Pasuruan", x: 511, y: 499, lx: 511, ly: 537 },
  { label: "Bangkalan", x: 521, y: 480, lx: 577, ly: 461, anchor: "start" },
  { label: "Sumenep", x: 544, y: 488, lx: 566, ly: 492, anchor: "start" },

  // Kalimantan
  { label: "Pontianak", x: 447, y: 333, lx: 425, ly: 291, anchor: "end" },
  { label: "Gunung Mas", x: 568, y: 358, lx: 568, ly: 320 },
  { label: "Katingan", x: 550, y: 378, lx: 532, ly: 359, anchor: "end" },
  { label: "Palangkaraya", x: 568, y: 380, lx: 586, ly: 361, anchor: "start" },
  { label: "Banjarmasin", x: 584, y: 398, lx: 606, ly: 402, anchor: "start" },

  // Sulawesi
  { label: "Maros", x: 716, y: 462, lx: 698, ly: 443, anchor: "end" },
  { label: "Konawe", x: 788, y: 437, lx: 806, ly: 418, anchor: "start" },

  // Bali & Nusa Tenggara
  { label: "Lombok Timur", x: 614, y: 533, lx: 614, ly: 571 },
  { label: "Dompu", x: 669, y: 535, lx: 669, ly: 497 },
  { label: "Bima", x: 677, y: 533, lx: 677, ly: 475 },
  { label: "Manggarai Timur", x: 724, y: 545, lx: 724, ly: 603 },
  { label: "Sumba Timur", x: 713, y: 578, lx: 713, ly: 636 },

  // Maluku
  { label: "Ambon", x: 963, y: 445, lx: 963, ly: 407 },
  { label: "Tual", x: 1120, y: 525, lx: 1102, ly: 506, anchor: "end" },
];

/** Tetesan air mata klasik: ujung runcing di (0,0), kepala bulat di atasnya. */
const PIN_PATH =
  "M0 0C-3-5-10.5-12-10.5-18.5A10.5 10.5 0 1 1 10.5-18.5C10.5-12 3-5 0 0Z";
const PIN_HEAD = -18.5;
const PIN_TOP = -29;

const tone = {
  tastaka: { body: "#B4181F", glow: "#F6C321" },
  tastaba: { body: "#1B2A63", glow: "#2FA36B" },
} as const;

function PinMark({ x, y, type }: { x: number; y: number; type: keyof typeof tone }) {
  return (
    <g transform={`translate(${x} ${y})`} filter={`url(#pin-glow-${type})`}>
      <path d={PIN_PATH} fill={tone[type].body} />
      <circle cy={PIN_HEAD} r={4.2} fill="#fff" />
    </g>
  );
}

export function IndonesiaMap() {
  const hasTastaba = pins.some((p) => p.type === "tastaba");

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div
        className="relative mx-auto min-w-[680px] max-w-4xl"
        style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
        role="img"
        aria-label="Peta sebaran program Gernas Tastaka di seluruh Indonesia"
      >
        <Image
          src="/media/peta-indonesia-clay.jpeg"
          alt=""
          fill
          priority={false}
          className="object-contain"
          sizes="(min-width: 1024px) 896px, 100vw"
        />

        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="absolute inset-0 h-full w-full font-sans"
        >
          <defs>
            {(Object.keys(tone) as (keyof typeof tone)[]).map((t) => (
              <filter
                key={t}
                id={`pin-glow-${t}`}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feDropShadow
                  dx="0"
                  dy="5"
                  stdDeviation="3.5"
                  floodColor={tone[t].glow}
                  floodOpacity="0.95"
                />
              </filter>
            ))}
          </defs>

          {pins.map((p) => {
            const type = p.type ?? "tastaka";
            const anchor = p.anchor ?? "middle";
            const above = p.ly < p.y + PIN_TOP;

            // Titik sambung di sisi label, menyesuaikan arah anchor.
            const tipX = anchor === "start" ? p.lx - 4 : anchor === "end" ? p.lx + 4 : p.lx;
            const tipY = anchor === "middle" ? (above ? p.ly + 4 : p.ly - 11) : p.ly - 4.5;
            const fromY = above ? p.y + PIN_TOP : p.y;
            const far = Math.hypot(tipX - p.x, tipY - fromY) > 26;

            return (
              <g key={p.label}>
                {far && (
                  <line
                    x1={p.x}
                    y1={fromY}
                    x2={tipX}
                    y2={tipY}
                    stroke="#1B2A63"
                    strokeWidth={1}
                    strokeOpacity={0.35}
                  />
                )}
                <PinMark x={p.x} y={p.y} type={type} />
                <text
                  x={p.lx}
                  y={p.ly}
                  textAnchor={anchor}
                  fontSize={14}
                  fontWeight={700}
                  fill="#1B2A63"
                  stroke="#fff"
                  strokeWidth={3.5}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          {hasTastaba && (
            <g>
              <PinMark x={1055} y={80} type="tastaba" />
              <text x={1072} y={73} fontSize={15} fontWeight={700} fill="#1B2A63">
                Gernas Tastaba
              </text>
              <PinMark x={1195} y={80} type="tastaka" />
              <text x={1212} y={73} fontSize={15} fontWeight={700} fill="#1B2A63">
                Gernas Tastaka
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
