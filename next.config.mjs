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
