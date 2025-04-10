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
};

export default nextConfig;
// module.exports = {
//     async rewrites() {
//       return [
//         {
//           source: '/api/:path*',
//           destination: 'http://api.lenaai.net/:path*',
//         },
//       ];
//     },
//   };
