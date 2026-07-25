import type { Config } from "tailwindcss";

/**
 * Design System v2.0 — Gernas Tastaka
 * Token source: Design reference screenshots (Beranda, Mitra, Tumbuh Bersama,
 * Tentang, Contact) approved in PRD OI-001.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand core
        brand: {
          red: "#B4181F", // brick red — primary CTA, red cards, testimonial
          "red-dark": "#8F1319",
          navy: "#1B2A63", // deep navy — dark cards, footer, stat counters
          "navy-dark": "#141F4A",
          blue: "#1E4F9E", // secondary blue card
          yellow: "#F6C321", // accent yellow — CTA, cards, highlights
          "yellow-dark": "#E0A800",
        },
        // Surfaces
        ink: "#1B2A63", // default heading color (navy)
        body: "#4A4A55", // body text
        surface: "#F4F5F7", // page background
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem", // 20px — card radius per DS v2.0
        pill: "9999px",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(27, 42, 99, 0.18)",
        "card-hover": "0 18px 40px -14px rgba(27, 42, 99, 0.28)",
        soft: "0 4px 16px rgba(27, 42, 99, 0.08)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
