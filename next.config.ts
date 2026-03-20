import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Documentation sections
      {
        source: '/docs/introduction/:path*',
        destination: '/documentation/introduction/:path*',
        permanent: true,
      },
      {
        source: '/docs/paycom-concepts/:path*',
        destination: '/documentation/paycom-concepts/:path*',
        permanent: true,
      },
      {
        source: '/docs/payments/:path*',
        destination: '/documentation/payments/:path*',
        permanent: true,
      },
      {
        source: '/docs/payment-methods/:path*',
        destination: '/documentation/payment-methods/:path*',
        permanent: true,
      },
      {
        source: '/docs/orchestration/:path*',
        destination: '/documentation/orchestration/:path*',
        permanent: true,
      },
      {
        source: '/docs/risk-disputes-fraud/:path*',
        destination: '/documentation/risk-disputes-fraud/:path*',
        permanent: true,
      },
      {
        source: '/docs/reporting-reconciliation/:path*',
        destination: '/documentation/reporting-reconciliation/:path*',
        permanent: true,
      },
      // Reference sections
      {
        source: '/docs/api-reference/:path*',
        destination: '/api-reference/:path*',
        permanent: true,
      },
      {
        source: '/docs/sdk-reference/:path*',
        destination: '/sdk-reference/:path*',
        permanent: true,
      },
      {
        source: '/docs/changelog/:path*',
        destination: '/changelog/:path*',
        permanent: true,
      },
      // /docs root
      {
        source: '/docs',
        destination: '/documentation/introduction',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
