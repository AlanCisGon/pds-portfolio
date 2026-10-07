/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/ux-strategy",
        destination: "/lab/ux-strategy",
        permanent: false,
      },
    ];
  },
  // Private lab artifacts live outside public/; ship them with the route.
  outputFileTracingIncludes: {
    "/lab/[slug]": ["./private/lab/**/*"],
    // The OG image reads static brand TTFs (Host Grotesk, Chivo Mono) and the avatar from disk.
    "/api/og/generate": ["./src/assets/og/*.ttf", "./public/images/avatar.jpg"],
  },
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
