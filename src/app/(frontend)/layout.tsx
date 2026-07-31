import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HtmlLangSync } from "@/components/HtmlLangSync";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gernastastaka.org"),
  title: {
    default: "Gernas Tastaka — Gerakan Nasional Pemberantasan Buta Matematika",
    template: "%s | Gernas Tastaka",
  },
  description:
    "Membangun fondasi masa depan Indonesia melalui pembelajaran matematika dan membaca yang bermakna dan bernalar. Gernas Tastaka melatih guru SD/MI di seluruh Indonesia.",
  keywords: [
    "Gernas Tastaka",
    "pendidikan dasar",
    "pelatihan guru",
    "numerasi",
    "literasi",
    "matematika SD",
  ],
  openGraph: {
    title: "Gernas Tastaka",
    description:
      "Gerakan masyarakat sipil untuk meningkatkan mutu pembelajaran matematika dan membaca di SD/MI Indonesia.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B2A63",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <HtmlLangSync />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
