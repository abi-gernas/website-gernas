/**
 * `NEXT_PUBLIC_SERVER_URL_DEV` mengisi domain preview (mis. dev.gernastastaka.org)
 * tanpa menimpa `NEXT_PUBLIC_SERVER_URL` yang dipakai deployment production.
 * Kosongkan/hapus variabel dev untuk kembali memakai domain production.
 */
export function getServerUrl(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL_DEV ?? process.env.NEXT_PUBLIC_SERVER_URL ?? "";
}

/**
 * Asal (origin) yang boleh memakai cookie login dasbor. Payload hanya menerima
 * cookie bila `Origin` permintaan ada di daftar ini; bawaannya cuma `serverURL`.
 * Domain produksi mengalihkan apex ke `www` (308), jadi staf yang mengetik
 * `gernastastaka.org/admin` mendarat di `www.` dan semua fungsi server dasbor
 * menjawab 401 "Unauthorized" padahal sudah login. Varian dengan/tanpa `www`
 * didaftarkan keduanya supaya urutan pengalihan tidak lagi menentukan.
 */
export function getCsrfOrigins(): string[] {
  const dasar = getServerUrl().replace(/\/+$/, "");
  if (!dasar) return [];
  try {
    const { protocol, hostname, port } = new URL(dasar);
    // Hanya domain bernama; localhost & IP tidak punya varian `www`.
    if (!hostname.includes(".") || /^\d+(\.\d+){3}$/.test(hostname)) return [dasar];
    const lawan = hostname.startsWith("www.") ? hostname.slice(4) : `www.${hostname}`;
    return [dasar, `${protocol}//${lawan}${port ? `:${port}` : ""}`];
  } catch {
    return [dasar];
  }
}
