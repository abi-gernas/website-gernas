import Image from "next/image";
import Link from "next/link";

export function CTABanner({
  title,
  body,
  cta,
  image,
}: {
  title: string;
  body?: string;
  cta: { label: string; href: string };
  image?: string;
}) {
  return (
    <div className="grid overflow-hidden rounded-card shadow-card md:grid-cols-2">
      <div className="relative min-h-[220px] bg-brand-red">
        {image && (
          <>
            <Image src={image} alt="" fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-brand-red/70" />
          </>
        )}
        <div className="relative flex h-full items-center p-8 sm:p-10">
          <h3 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
            {title}
          </h3>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5 bg-surface p-8 sm:p-10">
        {body && <p className="text-sm leading-relaxed text-body">{body}</p>}
        <Link href={cta.href} className="btn-red self-start">
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
