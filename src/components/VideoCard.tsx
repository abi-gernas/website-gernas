import Image from "next/image";

export type VideoItem = { title: string; thumb: string; href?: string };

export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <a
      href={video.href ?? "#"}
      className="group relative block aspect-video overflow-hidden rounded-card shadow-soft"
    >
      <Image
        src={video.thumb}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {/* play button */}
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-red shadow-lg transition group-hover:scale-110">
        <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <h4 className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white">
        {video.title}
      </h4>
    </a>
  );
}
