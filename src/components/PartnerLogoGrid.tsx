import Image from "next/image";

export type Partner = { name: string; logo: string };

/** Static responsive grid of partner logos */
export function PartnerLogoGrid({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Daftar mitra akan segera diperbarui.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
      {/* Kunci memakai posisi, bukan nama: beberapa mitra sengaja memakai nama
          yang sama ("Pemerintah Daerah") karena logonya berbeda-beda. */}
      {partners.map((p, i) => (
        <div
          key={i}
          className="relative flex h-16 w-32 items-center justify-center grayscale transition duration-300 hover:grayscale-0 sm:h-20 sm:w-40"
        >
          <Image
            src={p.logo}
            alt={p.name}
            fill
            sizes="160px"
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}

/** Continuous marquee strip of logos (pauses on hover / reduced-motion) */
export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  return (
    <div className="group relative overflow-hidden py-2">
      <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-10">
        {partners.map((p, i) => (
          <div key={`a-${i}`} className="relative h-14 w-32 shrink-0">
            <Image src={p.logo} alt={p.name} fill sizes="128px" className="object-contain" />
          </div>
        ))}
        {/* duplicate set for seamless loop — hidden from screen readers */}
        {partners.map((p, i) => (
          <div
            key={`b-${i}`}
            aria-hidden="true"
            className="relative h-14 w-32 shrink-0 motion-reduce:hidden"
          >
            <Image src={p.logo} alt="" fill sizes="128px" className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
