import type { Metadata } from "next";
import { HomeContent, homeMetadata } from "@/components/pages/HomeContent";

/** Beranda versi Inggris — lihat catatan locale di `../page.tsx`. */
export default function HomePageEN() {
  return <HomeContent locale="en" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata("en");
}
