/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:4000/api/:path*"
            : "https://trainlink.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
