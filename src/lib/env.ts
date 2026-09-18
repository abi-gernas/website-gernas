/**
 * `NEXT_PUBLIC_SERVER_URL_DEV` mengisi domain preview (mis. dev.gernastastaka.org)
 * tanpa menimpa `NEXT_PUBLIC_SERVER_URL` yang dipakai deployment production.
 * Kosongkan/hapus variabel dev untuk kembali memakai domain production.
 */
export function getServerUrl(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL_DEV ?? process.env.NEXT_PUBLIC_SERVER_URL ?? "";
}
