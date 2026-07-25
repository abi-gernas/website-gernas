/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Stray lockfiles exist in parent directories; pin the trace root to this app
  // so Next doesn't infer the wrong workspace root.
  outputFileTracingRoot: import.meta.dirname,
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
