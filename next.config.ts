import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const isAnalyze = process.env.ANALYZE === "true";

const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: isAnalyze,
})({
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.optimization.minimizer?.forEach((plugin: any) => {
        if (plugin.constructor.name === "TerserPlugin") {
          plugin.options.terserOptions.compress.drop_console = true;
        }
      });
    }
    return config;
  },
});

export default nextConfig;
