import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Satu instans Payload untuk seluruh server component.
 *
 * `getPayload` memang sudah menyimpan instansnya sendiri, tetapi menaruh
 * promise-nya di satu modul membuat setiap pemanggil memakai konfigurasi yang
 * sama dan menghindari dua sumber yang perlu diubah bila opsi koneksi berganti.
 */
export const payloadPromise = getPayload({ config });
