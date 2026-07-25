/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local migrated media lives in /public/media. Remote patterns kept as a
    // fallback for any asset still served from the legacy WordPress host.
    remotePatterns: [
      { protocol: "https", hostname: "www.gernastastaka.org" },
      { protocol: "https", hostname: "gernastastaka.org" },
    ],
  },
};

export default nextConfig;
