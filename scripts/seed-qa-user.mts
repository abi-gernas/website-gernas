/**
 * Buat akun admin UJI untuk QA dasbor di database lokal.
 *
 * Jalankan:  DATABASE_URI=postgresql://postgres@127.0.0.1:54329/scratch \
 *            DATABASE_URI_DIRECT=$DATABASE_URI npx tsx scripts/seed-qa-user.mts
 *
 * Sengaja menolak jalan kalau DATABASE_URI bukan localhost: akun ini hanya
 * untuk uji Playwright di database sementara, jangan pernah masuk ke Supabase.
 * Aman diulang (kata sandi disetel ulang bila akunnya sudah ada).
 * Kredensial dibaca dari `.env.qa` (dibuat otomatis, tidak di-commit).
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

// Kredensial disimpan di `.env.qa` (sudah di-.gitignore lewat `.env*`) — repo ini publik,
// jadi kata sandi tidak boleh ikut ter-commit. Dibuat acak pada jalan pertama.
const BERKAS_QA = ".env.qa";
if (!fs.existsSync(BERKAS_QA)) {
  const acak = (await import("crypto")).randomBytes(12).toString("base64url");
  fs.writeFileSync(BERKAS_QA, `QA_EMAIL=qa-playwright@example.test\nQA_PASSWORD=qa-${acak}\n`);
}
const kredensial = Object.fromEntries(
  fs
    .readFileSync(BERKAS_QA, "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const QA_EMAIL = kredensial.QA_EMAIL;
const QA_PASSWORD = kredensial.QA_PASSWORD;

if (!/@(127\.0\.0\.1|localhost)[:/]/.test(process.env.DATABASE_URI ?? "")) {
  console.error("Ditolak: DATABASE_URI bukan database lokal. Akun QA tidak boleh dibuat di database asli.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;
const payload = await getPayload({ config });

const ada = (await payload.find({ collection: "users", where: { email: { equals: QA_EMAIL } }, limit: 1 })).docs[0];
if (ada) {
  await payload.update({ collection: "users", id: ada.id, data: { password: QA_PASSWORD } });
  console.log("Akun QA diperbarui:", QA_EMAIL);
} else {
  await payload.create({
    collection: "users",
    data: { email: QA_EMAIL, password: QA_PASSWORD, name: "QA Playwright", role: "admin" },
  });
  console.log("Akun QA dibuat:", QA_EMAIL);
}
process.exit(0);
