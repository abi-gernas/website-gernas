import Image from "next/image";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Media } from "@/payload-types";

/**
 * Merender isi artikel dari pohon Lexical Payload.
 *
 * Converter bawaan dipakai untuk paragraf/heading/list, kecuali `upload` yang
 * ditimpa agar gambar memakai next/image (lazy load + srcset) alih-alih <img>
 * polos, dan mengikuti gaya kartu yang sama dengan sisa situs.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const value = node.value as Media | number | string | null;
    if (!value || typeof value !== "object" || !value.url) return null;

    return (
      <figure className="my-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={value.url}
            alt={value.alt ?? ""}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-2 text-center text-xs text-muted">
            {value.caption}
          </figcaption>
        )}
      </figure>
    );
  },
});

export function ArticleBody({ content }: { content: unknown }) {
  return (
    <RichText
      // Kelas prose lokal — lihat globals.css
      className="article-body space-y-5"
      converters={converters}
      data={content as never}
    />
  );
}
