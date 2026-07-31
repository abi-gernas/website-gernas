import Image from "next/image";
import Link from "next/link";

export function Logo({
  className = "",
  href = "/",
  ariaLabel = "Gernas Tastaka",
}: {
  className?: string;
  href?: string;
  ariaLabel?: string;
}) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`} aria-label={ariaLabel}>
      <Image
        src="/media/cropped-Logo_GernasTastaka-01-300x124.png"
        alt="Gernas Tastaka"
        width={300}
        height={124}
        priority
        className="h-10 w-auto sm:h-12"
      />
    </Link>
  );
}
