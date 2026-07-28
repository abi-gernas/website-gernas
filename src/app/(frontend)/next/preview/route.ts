import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { jalurInternal } from "@/lib/routes";

/**
 * Menyalakan draft mode Next lalu melempar ke halaman publik yang diminta.
 *
 * Dipanggil dasbor lewat `previewURL()` — baik sebagai `src` iframe Live
 * Preview maupun tujuan tombol "Pratinjau". Selama draft mode menyala,
 * `getPageBySlug`/`getArticleBySlug` mengambil versi draf terbaru dan Next
 * berhenti menyajikan versi statis hasil build.
 *
 * KEAMANAN: draft mode membuka akses ke konten yang belum terbit, jadi route
 * ini wajib memastikan pemanggilnya staf yang sudah masuk. Cookie sesi Payload
 * ikut terkirim karena dasbor dan situs publik berbagi domain yang sama.
 */
export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return new Response("Parameter `path` wajib diisi.", { status: 400 });
  }

  if (!jalurInternal(path)) {
    return new Response("Parameter `path` harus berupa alamat internal.", {
      status: 400,
    });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });

  if (!user) {
    return new Response(
      "Anda harus masuk ke dasbor terlebih dahulu untuk membuka pratinjau.",
      { status: 403 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  // `redirect` bekerja dengan melempar — jangan bungkus dalam try/catch.
  redirect(path);
}
