import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
  reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
