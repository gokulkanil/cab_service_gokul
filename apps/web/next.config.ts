import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

// The repository root, so Next.js can compile the shared workspace packages.
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@wcs/shared', '@wcs/db'],
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
