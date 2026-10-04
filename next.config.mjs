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
    // The OG image reads Geist TTFs and the avatar from disk.
    "/api/og/generate": [
      "./node_modules/geist/dist/fonts/geist-sans/Geist-{Regular,SemiBold}.ttf",
      "./node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
      "./public/images/avatar.jpg",
    ],
  },
  transpilePackages: ["next-mdx-remote", "geist"],
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
