/**
 * Isi produk "Buku Belajar Matematika Gernas Tastaka" (berbayar, tautan
 * Shopee) dari Google Sheet harga marketplace. Sampul menyusul.
 *
 * Jalankan:  npm run seed:buku-shopee
 * Aman diulang (dikenali lewat judul). `topik` & `jenjang` dugaan — betulkan di dasbor.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;
const payload = await getPayload({ config });

const judul = "Buku Belajar Matematika Gernas Tastaka";
const data = {
  judul,
  kategoriProduk: "buku" as const,
  topik: "bilangan-cacah" as const,
  jenjang: ["sd" as const],
  mapel: ["matematika" as const],
  status: "berbayar" as const,
  harga: 59000,
  format: ["cetak" as const],
  tautanMarketplace: [
    { platform: "shopee" as const, url: "https://shopee.co.id/product/934681159/23717571551/" },
  ],
};

const ada = (
  await payload.find({ collection: "produk", where: { judul: { equals: judul } }, limit: 1, depth: 0 })
).docs[0];
if (ada) {
  await payload.update({ collection: "produk", id: ada.id, data, locale: "id" });
  console.log("Buku diperbarui.");
} else {
  await payload.create({ collection: "produk", data, locale: "id" });
  console.log("Buku dibuat.");
}
process.exit(0);
