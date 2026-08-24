import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root so a leftover lockfile in $HOME does not steal it.
  // Expanding this to /home/sk would watch the whole home directory.
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Default is CPUs-1 (19 on this machine). That spawned a page-data worker
    // storm during `next build` and contributed to global OOM. Cap it.
    cpus: 4,
    memoryBasedWorkersCount: true,
  },
  serverExternalPackages: ["@copilotkit/runtime"],
  env: {
    NEXT_PUBLIC_COPILOTKIT_THREADS_ENABLED: process.env.COPILOTKIT_LICENSE_TOKEN
      ? "true"
      : "false",
  },
  typescript: {
    // @mastra/memory beta packages have unstable types that break strict checking
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
