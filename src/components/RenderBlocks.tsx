import { HeroCarousel, PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { StatCounterRow } from "@/components/StatCounterRow";
import { ValueCards } from "@/components/ValueCards";
import { CTABanner } from "@/components/CTABanner";
import { NewsCard } from "@/components/NewsCard";
import { ArticleBody } from "@/components/ArticleBody";
import { Timeline } from "@/components/Timeline";
import { VisiMisi } from "@/components/VisiMisi";
import { TeamGrid } from "@/components/TeamGrid";
import { Gallery } from "@/components/Gallery";
import { IdeaCards } from "@/components/IdeaCards";
import { FeatureCards } from "@/components/FeatureCards";
import { ActivityCards } from "@/components/ActivityCards";
import { Callout } from "@/components/Callout";
import { DonationCampaigns } from "@/components/DonationCampaigns";
import { DonationTierButtons } from "@/components/DonationTierButtons";
import { TrainingModules } from "@/components/TrainingModules";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ProgramIntensifCarousel } from "@/components/ProgramIntensifCarousel";
import { IndonesiaMap } from "@/components/IndonesiaMap";
import { ContactForm } from "@/components/ContactForm";
import { PartnerLogoGrid, PartnerMarquee } from "@/components/PartnerLogoGrid";
import { VideoCard } from "@/components/VideoCard";
import { JadwalAcara } from "@/components/JadwalAcara";
import { PencarianCepat } from "@/components/library/PencarianCepat";
import { ProdukSorotan } from "@/components/library/ProdukSorotan";
import { PerangkatGuru, type StatistikPerangkat } from "@/components/library/PerangkatGuru";
import { labelKatalogGuru } from "@/components/library/Breadcrumb";
import { IntroDuaKolom } from "@/components/IntroDuaKolom";
import { Komunitas } from "@/components/Komunitas";
import { TentangRingkas } from "@/components/TentangRingkas";
import Link from "next/link";
import { getArticles } from "@/lib/content";
import { getProdukById, getProdukTerbaru } from "@/lib/produk";
import {
  KATALOG_GURU,
  getGambarKatalogGuru,
  getJumlahKatalogGuru,
  katalogGuruPath,
} from "@/lib/perangkatGuru";
import { localizedPath, uiText, type Locale } from "@/lib/i18n";
import {
  getAcara,
  getMitra,
  getModulPelatihan,
  getPenggerak,
  getSiteSettings,
  getVideo,
  kelompokMitraLabel,
  mediaURL,
  urutanKelompokMitra,
} from "@/lib/datasitus";
import { contact as fallbackContact } from "@/lib/nav";
import { asWarna, kolomKe } from "@/components/warna";
import { asNamaIkon } from "@/components/ikon";
import type { Page } from "@/payload-types";

/**
 * Menerjemahkan `layout` koleksi Halaman menjadi komponen Design System v2.0.
 *
 * Ini bagian yang menutup rantai US-002: tanpanya staf bisa menyusun blok di
 * dasbor tetapi halamannya tidak ter-render di mana pun. Setiap blok di
 * `src/payload/blocks/` wajib punya cabang di sini — bila tidak, blok itu
 * dilewati diam-diam agar satu blok yang belum didukung tidak menjatuhkan
 * seluruh halaman.
 *
 * Blok yang isinya berasal dari koleksi "Data Situs" (Penggerak, Mitra, Video,
 * Modul Pelatihan) mengambil datanya sendiri di sini, bukan lewat props dari
 * halaman, supaya menambahkan blok itu ke halaman baru tidak menuntut
 * perubahan di route mana pun.
 */

/** Satu elemen di dalam field `layout`. */
type Block = NonNullable<Page["layout"]>[number];

/**
 * Grup CTA dari dasbor selalu ada sebagai objek, tetapi label & tautannya
 * opsional. Komponen hanya menerima CTA yang lengkap.
 */
function toCTA(
  cta: { label?: string | null; href?: string | null } | null | undefined,
  locale: Locale,
): { label: string; href: string } | undefined {
  if (!cta?.label || !cta?.href) return undefined;
  return { label: cta.label, href: localizedPath(cta.href, locale) };
}

/** Ambil URL + alt sekaligus — dipakai blok yang menampilkan banyak gambar. */
function toFoto(value: unknown): { url: string; alt: string } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as { url?: string | null; alt?: string | null };
  return m.url ? { url: m.url, alt: m.alt ?? "" } : null;
}

/** Lebar konten standar — blok non-full-bleed dibungkus ini. */
function Contained({ children }: { children: React.ReactNode }) {
  return <div className="container-page py-12 sm:py-16">{children}</div>;
}

// ─── Blok yang mengambil datanya sendiri ──────────────────────────────────

async function LatestNews({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "latestNews" }>;
  locale: Locale;
}) {
  const categoryId =
    block.category && typeof block.category === "object"
      ? block.category.id
      : (block.category ?? undefined);

  const articles = await getArticles(block.limit ?? 3, categoryId ?? undefined, locale);
  if (articles.length === 0) return null;

  const cta = toCTA(block.cta, locale);
  const text = uiText[locale];

  return (
    <Section title={block.heading ?? text.latestNews} id={block.anchor ?? undefined}>
      <div className={`grid gap-6 ${kolomKe(block.kolom)}`}>
        {articles.map((a) => (
          <NewsCard key={a.id} article={a} locale={locale} />
        ))}
      </div>
      {cta && (
        <div className="mt-8 flex justify-center">
          <Link href={cta.href} className="btn-outline">
            {cta.label}
          </Link>
        </div>
      )}
    </Section>
  );
}

async function Penggerak({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "teamGrid" }>;
  locale: Locale;
}) {
  const docs = await getPenggerak(locale);
  if (docs.length === 0) return null;

  const anggota = docs.map((d) => ({
    nama: d.nama,
    foto: mediaURL(d.foto),
    peran: (d.peran ?? []).map((p) => p.nama).filter(Boolean),
  }));

  return (
    <Section title={block.heading ?? undefined} id={block.anchor ?? undefined}>
      <TeamGrid anggota={anggota} locale={locale} batasAwal={block.batasAwal ?? undefined} />
    </Section>
  );
}

async function LogoMitra({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "partnerLogos" }>;
  locale: Locale;
}) {
  const barisan = block.tampilan === "barisan";
  const docs = await getMitra(barisan, locale);
  if (docs.length === 0) return null;

  const cta = toCTA(block.cta, locale);
  const toPartner = (d: (typeof docs)[number]) => ({
    name: d.nama,
    logo: mediaURL(d.logo) ?? "",
  });

  return (
    <Section title={block.heading ?? undefined} className="bg-surface">
      {barisan ? (
        <PartnerMarquee partners={docs.map(toPartner).filter((p) => p.logo)} />
      ) : (
        <div className="space-y-14">
          {urutanKelompokMitra.map((kelompok) => {
            const anggota = docs
              .filter((d) => d.kelompok === kelompok)
              .map(toPartner)
              .filter((p) => p.logo);
            if (anggota.length === 0) return null;

            return (
              <div key={kelompok}>
                <h3 className="mb-8 text-center text-lg font-bold text-brand-red sm:text-xl">
                  {kelompokMitraLabel[locale][kelompok]}
                </h3>
                <PartnerLogoGrid partners={anggota} locale={locale} />
              </div>
            );
          })}
        </div>
      )}
      {cta && (
        <div className="mt-8 flex justify-center">
          <Link href={cta.href} className="btn-yellow">
            {cta.label}
          </Link>
        </div>
      )}
    </Section>
  );
}

async function DaftarVideo({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "videoGrid" }>;
  locale: Locale;
}) {
  const docs = await getVideo(block.limit, locale);
  if (docs.length === 0) return null;

  return (
    <Section title={block.heading ?? undefined}>
      <div className={`grid gap-6 ${kolomKe(block.kolom)}`}>
        {docs.map((v) => (
          <VideoCard
            key={v.id}
            video={{
              title: v.judul,
              thumb: mediaURL(v.thumbnail) ?? "",
              href: v.tautan ?? undefined,
            }}
          />
        ))}
      </div>
    </Section>
  );
}

async function ModulPelatihanBlok({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "trainingModules" }>;
  locale: Locale;
}) {
  const docs = await getModulPelatihan(block.program, locale);
  if (docs.length === 0) return null;

  const modul = docs.map((d) => ({
    nomor: d.nomor,
    judul: d.judul,
    tujuan: (d.tujuan ?? []).map((t) => t.teks).filter(Boolean),
  }));

  const sidebarCTA = toCTA(block.sidebar?.cta, locale);

  return (
    <Section title={block.heading ?? undefined}>
      <TrainingModules
        modul={modul}
        tampilan={block.tampilan}
        locale={locale}
        sidebar={
          block.sidebar?.teks
            ? {
                teks: block.sidebar.teks,
                ajakan: block.sidebar.ajakan ?? undefined,
                cta: sidebarCTA,
              }
            : undefined
        }
      />
    </Section>
  );
}

async function JadwalAcaraBlok({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "jadwalAcara" }>;
  locale: Locale;
}) {
  const docs = await getAcara(locale);
  if (docs.length === 0) return null;

  const acara = docs.map((d) => ({
    judul: d.judul,
    kategori: d.kategori,
    poster: mediaURL(d.poster),
    tanggal: d.tanggal,
    waktu: d.waktu ?? undefined,
    format: d.format,
    lokasi: d.lokasi ?? undefined,
    tautanDaftar: d.tautanDaftar?.trim()
      ? localizedPath(d.tautanDaftar.trim(), locale)
      : undefined,
  }));

  const umum = {
    acara,
    patokan: Date.now(),
    locale,
    batasAwal: block.batasAwal ?? undefined,
    sembunyikanSelesai: Boolean(block.sembunyikanSelesai),
  };

  if (block.tampilan === "geser") {
    const lihatSemua = toCTA(block.tautanLihatSemua, locale);
    const kepala =
      block.heading || block.deskripsi || lihatSemua ? (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0 max-w-2xl">
            {block.heading && (
              <h2 className="text-xl font-bold text-brand-navy [text-wrap:balance] sm:text-2xl">
                {block.heading}
              </h2>
            )}
            {block.deskripsi && (
              <p className="mt-1.5 text-sm leading-relaxed text-body">{block.deskripsi}</p>
            )}
          </div>
          {lihatSemua && (
            <Link
              href={lihatSemua.href}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
            >
              {lihatSemua.label}
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
      ) : undefined;

    return <JadwalAcara {...umum} tampilan="geser" kepala={kepala} id={block.anchor ?? undefined} />;
  }

  return (
    <Section
      title={block.heading ?? undefined}
      subtitle={block.deskripsi ?? undefined}
      id={block.anchor ?? undefined}
    >
      <JadwalAcara {...umum} />
    </Section>
  );
}

async function ProdukSorotanBlok({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "produkSorotan" }>;
  locale: Locale;
}) {
  // Produk pilihan staf; kosong (atau sudah dihapus) → produk "Produk Terbaru"
  // katalog, supaya blok tidak pernah hilang hanya karena relasinya putus.
  const idProduk =
    block.produk && typeof block.produk === "object" ? block.produk.id : block.produk;
  const item =
    (idProduk ? await getProdukById(idProduk, locale) : null) ?? (await getProdukTerbaru(locale));
  if (!item) return null;

  const poin = (block.alasan?.poin ?? []).map((p) => p.teks).filter(Boolean);

  return (
    <ProdukSorotan
      judulBagian={block.heading ?? undefined}
      subjudul={block.subjudul ?? undefined}
      item={item}
      alasan={poin.length > 0 ? { judul: block.alasan?.judul ?? undefined, poin } : undefined}
      locale={locale}
    />
  );
}

/** Gambar ilustrasi panel bila staf belum mengunggah — sama dengan banner bantuan Library. */
const ILUSTRASI_CS = "/ilustrasi/cs-bantuan.png";

async function PerangkatGuruBlok({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: "perangkatGuru" }>;
  locale: Locale;
}) {
  const kartuMentah = block.kartu ?? [];
  const statMentah = block.panel?.statistik ?? [];

  // Kartu tanpa gambar unggahan memakai sampul materi pertama katalognya.
  const [jumlah, gambarBawaan] = await Promise.all([
    statMentah.some((s) => s.sumber !== "manual") ? getJumlahKatalogGuru() : null,
    Promise.all(
      kartuMentah.map((k) => (mediaURL(k.gambar) ? null : getGambarKatalogGuru(k.katalog))),
    ),
  ]);

  const kartu = kartuMentah.map((k, i) => ({
    judul: k.judul || labelKatalogGuru[k.katalog][locale],
    deskripsi: k.deskripsi ?? undefined,
    href: katalogGuruPath(k.katalog, locale),
    gambar: mediaURL(k.gambar) ?? gambarBawaan[i] ?? undefined,
    warna: asWarna(k.warna),
  }));

  const statistik = statMentah.flatMap((s): StatistikPerangkat[] => {
    if (s.sumber === "manual") {
      return s.angka != null && s.label
        ? [{ angka: s.angka, akhiran: s.akhiran ?? undefined, label: s.label, sumber: s.sumber }]
        : [];
    }
    if (!jumlah) return [];
    const angka =
      s.sumber === "semua" ? KATALOG_GURU.reduce((n, k) => n + jumlah[k], 0) : jumlah[s.sumber];
    const label =
      s.label ||
      (s.sumber === "semua"
        ? locale === "en"
          ? "Learning Materials"
          : "Materi Pembelajaran"
        : labelKatalogGuru[s.sumber][locale]);
    return [{ angka, akhiran: s.akhiran ?? undefined, label, sumber: s.sumber }];
  });

  const panel = block.panel;
  const cta = toCTA(panel?.cta, locale);
  const adaPanel = statistik.length > 0 || Boolean(panel?.judul || panel?.isi || cta);
  if (kartu.length === 0 && !adaPanel) return null;

  return (
    <PerangkatGuru
      judul={block.judul ?? undefined}
      subjudul={block.subjudul ?? undefined}
      kartu={kartu}
      panel={
        adaPanel
          ? {
              statistik,
              judul: panel?.judul ?? undefined,
              isi: panel?.isi ?? undefined,
              gambar: mediaURL(panel?.gambar) ?? ILUSTRASI_CS,
              cta,
            }
          : undefined
      }
      locale={locale}
    />
  );
}

// ─── Pemetaan blok → komponen ─────────────────────────────────────────────

async function RenderBlock({
  block,
  locale,
  pertama = false,
}: {
  block: Block;
  locale: Locale;
  /** Blok paling atas halaman — blok hero yang judulnya bisa jadi `<h1>`. */
  pertama?: boolean;
}) {
  switch (block.blockType) {
    case "hero": {
      const slides = (block.slides ?? []).flatMap((s) => {
        const image = mediaURL(s.image);
        // Gambar wajib di skema; slide tanpa gambar berarti relasinya terputus.
        if (!image) return [];
        return [
          {
            title: s.title,
            highlight: s.highlight ?? undefined,
            description: s.description ?? undefined,
            image,
            cta: toCTA(s.cta, locale),
          },
        ];
      });
      return slides.length > 0 ? <HeroCarousel slides={slides} /> : null;
    }

    case "pageHero": {
      const image = mediaURL(block.image);
      if (!image) return null;
      return (
        <>
          <PageHero
            title={block.title}
            description={block.description ?? undefined}
            image={image}
            tint={block.tint ?? "navy"}
          />
          {block.garisBawah && <div className="h-2 bg-brand-yellow" />}
        </>
      );
    }

    case "pencarianCepat":
      return (
        <PencarianCepat
          judul={block.judul}
          subjudul={block.subjudul ?? undefined}
          gambar={mediaURL(block.gambarLatar)}
          placeholder={block.placeholder ?? undefined}
          tagPopuler={(block.tagPopuler ?? []).map((t) => t.label).filter(Boolean)}
          locale={locale}
          judulHalaman={pertama}
        />
      );

    case "introDuaKolom":
      return (
        <IntroDuaKolom judul={block.judul} ringkas={block.ringkas ?? undefined}>
          {block.isi ? <ArticleBody content={block.isi} /> : null}
        </IntroDuaKolom>
      );

    case "komunitas": {
      const kartu = (block.kartu ?? []).map((k) => ({
        nama: k.nama,
        deskripsi: k.deskripsi ?? undefined,
        warna: k.warna === "merah" ? ("merah" as const) : ("navy" as const),
        ikon: asNamaIkon(k.ikon),
        ilustrasi: mediaURL(k.ilustrasi),
        cta: toCTA(k.cta, locale),
      }));
      if (kartu.length === 0) return null;
      return (
        <Komunitas judul={block.judul ?? undefined} subjudul={block.subjudul ?? undefined} kartu={kartu} />
      );
    }

    case "tentangRingkas":
      return (
        <TentangRingkas
          judul={block.judul}
          isi={block.isi ?? undefined}
          cta={toCTA(block.cta, locale)}
          fakta={(block.fakta ?? []).map((f) => ({ ikon: asNamaIkon(f.ikon), teks: f.teks }))}
        />
      );

    case "richText": {
      const lebar = block.lebar === "penuh" ? "" : "mx-auto max-w-4xl";
      const rata = block.rataTengah ? "text-center" : "";
      return (
        <Section title={block.heading ?? undefined}>
          <div className={`${lebar} ${rata}`.trim()}>
            <ArticleBody content={block.content} />
          </div>
        </Section>
      );
    }

    case "featureCards": {
      const cards = (block.cards ?? []).map((c) => ({
        judul: c.judul,
        subjudul: c.subjudul ?? undefined,
        isi: c.isi,
        gambar: mediaURL(c.gambar),
        warna: c.warna,
        cta: toCTA(c.cta, locale),
      }));
      if (cards.length === 0) return null;

      const sampingURL = mediaURL(block.gambarSamping?.gambar);

      return (
        <Section title={block.heading ?? undefined}>
          <FeatureCards
            cards={cards}
            kolom={block.kolom ?? undefined}
            gambarSamping={
              sampingURL
                ? {
                    url: sampingURL,
                    judul: block.gambarSamping?.judul ?? undefined,
                    judulSorot: block.gambarSamping?.judulSorot ?? undefined,
                  }
                : undefined
            }
          />
        </Section>
      );
    }

    case "visiMisi": {
      const misi = (block.misi ?? []).map((m) => m.teks).filter(Boolean);
      return (
        <Section>
          <VisiMisi
            heading={block.heading ?? undefined}
            visi={block.visi}
            misi={misi}
            tataNilai={block.tataNilai ?? undefined}
            locale={locale}
          />
        </Section>
      );
    }

    case "activityCards": {
      const kartu = (block.kartu ?? []).map((k) => ({
        judul: k.judul,
        deskripsi: k.deskripsi,
        ikon: asNamaIkon(k.ikon),
      }));
      if (kartu.length === 0) return null;

      return (
        <Section title={block.heading ?? undefined}>
          <ActivityCards kartu={kartu} kolom={block.kolom ?? undefined} />
        </Section>
      );
    }

    case "valueCards": {
      const cards = (block.cards ?? []).map((c) => ({
        title: c.title,
        body: c.body,
        tone: c.tone,
        cta: toCTA(c.cta, locale),
        links: (c.links ?? []).flatMap((l) =>
          l.label && l.href
            ? [{ label: l.label, href: localizedPath(l.href, locale) }]
            : [],
        ),
      }));
      if (cards.length === 0) return null;

      // Tampilan beranda: kartu naik menutupi bagian bawah hero di atasnya.
      if (block.tumpukDiAtasHero) {
        return (
          <div className="container-page relative z-10 -mt-14 sm:-mt-24">
            <ValueCards cards={cards} />
          </div>
        );
      }
      return (
        <Contained>
          <ValueCards cards={cards} />
        </Contained>
      );
    }

    case "callout":
      return (
        <Section>
          <Callout
            judul={block.judul}
            isi={block.isi ?? undefined}
            warna={block.warna}
            gambar={(block.gambar ?? [])
              .map(toFoto)
              .filter((f): f is { url: string; alt: string } => Boolean(f))}
            cta={toCTA(block.cta, locale)}
            tautanTambahan={(block.tautanTambahan ?? []).map((t) => ({
              awalan: t.awalan ?? undefined,
              label: t.label,
              href: t.href ? localizedPath(t.href, locale) : undefined,
            }))}
            rataTengah={Boolean(block.rataTengah)}
          />
        </Section>
      );

    case "programIntensif": {
      const items = (block.programs ?? []).map((p) => ({
        gambar: mediaURL(p.gambar),
        judul: p.judul,
        deskripsi: p.deskripsi,
        warna: p.warna,
        kolaborator: (p.kolaborator ?? []).flatMap((k) => {
          const url = mediaURL(k);
          return url ? [url] : [];
        }),
      }));
      if (items.length === 0) return null;

      return (
        <Section>
          {(block.heading || block.isi) && (
            <div className="mx-auto mb-10 max-w-3xl">
              {block.heading && (
                <h2 className="text-xl font-bold text-brand-red sm:text-2xl">
                  {block.heading}
                </h2>
              )}
              {block.isi && (
                <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
                  {block.isi}
                </p>
              )}
            </div>
          )}
          <ProgramIntensifCarousel items={items} />
        </Section>
      );
    }

    case "ctaBanner":
      return (
        <Contained>
          <CTABanner
            title={block.title}
            body={block.body ?? undefined}
            cta={toCTA(block.cta, locale)}
            image={mediaURL(block.image)}
          />
        </Contained>
      );

    case "timeline": {
      const entries = (block.entries ?? []).map((e) => ({
        tahun: e.tahun,
        teks: e.teks,
        foto: mediaURL(e.foto),
      }));
      return entries.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <Timeline entries={entries} />
        </Section>
      ) : null;
    }

    case "statCounter": {
      const stats = (block.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        label: s.label,
      }));
      return stats.length > 0 ? (
        <Section title={block.heading ?? undefined}>
          <StatCounterRow stats={stats} />
        </Section>
      ) : null;
    }

    case "latestNews":
      return <LatestNews block={block} locale={locale} />;

    case "teamGrid":
      return <Penggerak block={block} locale={locale} />;

    case "partnerLogos":
      return <LogoMitra block={block} locale={locale} />;

    case "videoGrid":
      return <DaftarVideo block={block} locale={locale} />;

    case "trainingModules":
      return <ModulPelatihanBlok block={block} locale={locale} />;

    case "jadwalAcara":
      return <JadwalAcaraBlok block={block} locale={locale} />;

    case "produkSorotan":
      return <ProdukSorotanBlok block={block} locale={locale} />;

    case "perangkatGuru":
      return <PerangkatGuruBlok block={block} locale={locale} />;

    case "gallery": {
      const foto = (block.images ?? [])
        .map(toFoto)
        .filter((f): f is { url: string; alt: string } => Boolean(f));
      return foto.length > 0 ? (
        <Section title={block.heading ?? undefined}>
          <Gallery foto={foto} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

    case "testimonials": {
      const items = (block.items ?? []).map((t) => ({
        quote: t.kutipan,
        name: t.nama,
        role: t.peran ?? "",
        photo: mediaURL(t.foto),
      }));
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <TestimonialCarousel items={items} />
        </Section>
      ) : null;
    }

    case "indonesiaMap": {
      const stats = (block.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        label: s.label,
      }));
      return (
        <Section title={block.heading ?? undefined}>
          {block.tampilkanPeta !== false && <IndonesiaMap />}
          {stats.length > 0 && (
            <div className="mt-10">
              <StatCounterRow stats={stats} />
            </div>
          )}
        </Section>
      );
    }

    case "ideaCards": {
      const items = (block.items ?? []).flatMap((i) => {
        const gambar = mediaURL(i.gambar);
        if (!gambar) return [];
        return [
          {
            judul: i.judul,
            kelas: i.kelas ?? undefined,
            topik: i.topik ?? undefined,
            gambar,
            href: i.href ?? undefined,
          },
        ];
      });
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <IdeaCards items={items} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

    case "contactForm": {
      const settings = await getSiteSettings(locale);
      const contact = {
        email: settings.email || fallbackContact.email,
        phone: settings.phone || fallbackContact.phone,
        address: settings.address || fallbackContact.address,
      };
      return (
        <Section
          title={block.heading ?? uiText[locale].contactUs}
          id={block.anchor ?? undefined}
          className="bg-surface"
        >
          <ContactForm locale={locale} contact={contact} />
        </Section>
      );
    }

    case "donationTiers":
      return (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
                {block.judul}
                {block.judulSorot && (
                  <> <span className="text-brand-red">{block.judulSorot}</span></>
                )}
              </h1>
              {block.isi && (
                <p className="mt-5 text-sm leading-relaxed text-body sm:text-base">
                  {block.isi}
                </p>
              )}
            </div>
            <DonationTierButtons locale={locale} />
          </div>
        </Section>
      );

    case "donationCampaigns": {
      const items = (block.items ?? []).flatMap((c) => {
        const gambar = mediaURL(c.gambar);
        if (!gambar) return [];
        return [
          {
            judul: c.judul,
            gambar,
            terkumpul: c.terkumpul,
            target: c.target,
            cta: toCTA(c.cta, locale),
          },
        ];
      });
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <DonationCampaigns items={items} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

    default:
      // Blok baru yang belum punya komponen — sengaja tidak menggagalkan render.
      return null;
  }
}

export function RenderBlocks({
  blocks,
  locale,
}: {
  blocks: Page["layout"];
  locale: Locale;
}) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock
          key={block.id ?? `${block.blockType}-${i}`}
          block={block}
          locale={locale}
          pertama={i === 0}
        />
      ))}
    </>
  );
}
