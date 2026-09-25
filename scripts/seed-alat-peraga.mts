/**
 * Isi produk Alat Peraga "Desimalken" (varian, harga & tautan Shopee) dari
 * Google Sheet harga marketplace.
 *
 * Jalankan:  npm run seed:alat-peraga [-- --cover=/jalur/ke/foto.png]  (sampul opsional)
 *
 * Aman diulang: dokumen dikenali lewat slug, media lewat `legacyPath`.
 * `topik`, `jenjang`, dan `ringkasan` adalah dugaan — betulkan lewat dasbor.
 */
import fs from "fs";
import path from "path";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const coverArg = process.argv.find((a) => a.startsWith("--cover="))?.split("=")[1];

const payload = await getPayload({ config });

let media: { id: number | string } | undefined;
if (coverArg) {
  const legacyPath = "alat-peraga:desimalken";
  media = (
    await payload.find({ collection: "media", where: { legacyPath: { equals: legacyPath } }, limit: 1, depth: 0 })
  ).docs[0];
  if (!media) {
    const buf = fs.readFileSync(coverArg);
    const ext = path.extname(coverArg).slice(1).toLowerCase().replace("jpg", "jpeg");
    media = await payload.create({
      collection: "media",
      data: { alt: "Alat peraga Desimalken", legacyPath },
      file: { data: buf, name: path.basename(coverArg), mimetype: `image/${ext}`, size: buf.length },
    });
  }
}

const data = {
  judul: "Desimalken",
  kategoriProduk: "alat-peraga" as const,
  topik: "pecahan" as const,
  jenjang: ["sd" as const],
  mapel: ["matematika" as const],
  ...(media ? { cover: media.id } : {}),
  varian: [
    { nama: "Plastik OPP Tanpa Donasi", harga: 12000 },
    { nama: "Plastik OPP Bernalar", harga: 62000 },
    { nama: "Kotak Putih Tanda Donasi", harga: 16000 },
    { nama: "Kotak Putih Bernalar", harga: 66000 },
  ],
  tautanMarketplace: [
    { platform: "shopee" as const, url: "https://shopee.co.id/product/934681159/22746201342/" },
  ],
};

const ada = (
  await payload.find({ collection: "produk", where: { slug: { equals: "desimalken" } }, limit: 1, depth: 0 })
).docs[0];
if (ada) {
  await payload.update({ collection: "produk", id: ada.id, data, locale: "id" });
  console.log("Desimalken diperbarui.");
} else {
  await payload.create({ collection: "produk", data, locale: "id" });
  console.log("Desimalken dibuat.");
}
process.exit(0);
