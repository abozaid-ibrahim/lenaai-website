/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/lenaai/**",
      },
    ],
  },
  i18n: {
    locales: ["en", "ar"],  // Supported locales
    defaultLocale: "ar", // Default locale
    localeDetection: true, // Enable automatic locale detection
  },
};

export default nextConfig;