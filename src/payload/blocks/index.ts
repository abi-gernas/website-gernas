import type { Block } from "payload";

import { HeroBlock, PageHeroBlock } from "./hero";
import {
  ActivityCardsBlock,
  CTABannerBlock,
  CalloutBlock,
  FeatureCardsBlock,
  ProgramIntensifBlock,
  RichTextBlock,
  StatCounterBlock,
  TimelineBlock,
  ValueCardsBlock,
} from "./konten";
import {
  LatestNewsBlock,
  PartnerLogosBlock,
  TeamGridBlock,
  TrainingModulesBlock,
  VideoGridBlock,
} from "./koleksi";
import {
  ContactFormBlock,
  DonationCampaignsBlock,
  DonationTiersBlock,
  GalleryBlock,
  IdeaCardsBlock,
  IndonesiaMapBlock,
  TestimonialsBlock,
} from "./media";

/**
 * Blok yang tersedia untuk field `layout` di koleksi Halaman.
 *
 * Definisinya dipecah menurut asal isinya, bukan menurut tampilan:
 *  - hero.ts    — pembuka halaman
 *  - konten.ts  — isinya diketik langsung di dalam blok
 *  - koleksi.ts — isinya diambil dari koleksi "Data Situs"
 *  - media.ts   — bertumpu pada gambar atau komponen khusus
 *
 * Urutan array ini adalah urutan yang dilihat staf saat menekan "Tambah Blok",
 * jadi disusun dari yang paling sering dipakai ke yang paling khusus — bukan
 * menurut abjad.
 *
 * Setiap blok di sini WAJIB punya cabang di `src/components/RenderBlocks.tsx`.
 * Bila tidak, blok itu dilewati diam-diam saat render.
 */
export const pageBlocks: Block[] = [
  // Pembuka halaman
  HeroBlock,
  PageHeroBlock,

  // Isi yang diketik langsung
  RichTextBlock,
  FeatureCardsBlock,
  ValueCardsBlock,
  ActivityCardsBlock,
  CalloutBlock,
  CTABannerBlock,
  TimelineBlock,
  StatCounterBlock,
  ProgramIntensifBlock,

  // Isi dari koleksi Data Situs
  LatestNewsBlock,
  TeamGridBlock,
  PartnerLogosBlock,
  VideoGridBlock,
  TrainingModulesBlock,

  // Bergambar & komponen khusus
  GalleryBlock,
  TestimonialsBlock,
  IndonesiaMapBlock,
  IdeaCardsBlock,
  ContactFormBlock,
  DonationTiersBlock,
  DonationCampaignsBlock,
];

export {
  ActivityCardsBlock,
  CTABannerBlock,
  CalloutBlock,
  ContactFormBlock,
  DonationCampaignsBlock,
  DonationTiersBlock,
  FeatureCardsBlock,
  GalleryBlock,
  HeroBlock,
  IdeaCardsBlock,
  IndonesiaMapBlock,
  LatestNewsBlock,
  PageHeroBlock,
  PartnerLogosBlock,
  ProgramIntensifBlock,
  RichTextBlock,
  StatCounterBlock,
  TeamGridBlock,
  TestimonialsBlock,
  TimelineBlock,
  TrainingModulesBlock,
  ValueCardsBlock,
  VideoGridBlock,
};
