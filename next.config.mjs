/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Uploaded photos are processed entirely client-side (canvas), so no
    // remote image domains are required.
    unoptimized: true,
  },
};

export default nextConfig;
