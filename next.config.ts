import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@writechoice/fumadocs-mcp'],
  async rewrites() {
    return [
      {
        // Rewrite /<any-path>.md to /llms.md/<any-path> so AI agents
        // can fetch raw markdown by appending .md to any page URL.
        source: '/:path*.md',
        destination: '/llms.md/:path*',
      },
    ];
  },
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
      // Webhooks moved from documentation/payments to api-reference
      {
        source: '/documentation/payments/webhooks',
        destination: '/api-reference/webhooks',
        permanent: true,
      },
      {
        source: '/documentation/payments/webhooks/:path*',
        destination: '/api-reference/webhooks/:path*',
        permanent: true,
      },
      // API Reference restructure: root → get-started landing
      {
        source: '/api-reference',
        destination: '/api-reference/get-started',
        permanent: true,
      },
      // API Reference restructure: get-started pages
      {
        source: '/api-reference/authentication',
        destination: '/api-reference/get-started/authentication',
        permanent: true,
      },
      {
        source: '/api-reference/environments',
        destination: '/api-reference/get-started/environments',
        permanent: true,
      },
      {
        source: '/api-reference/http-response-codes',
        destination: '/api-reference/get-started/http-response-codes',
        permanent: true,
      },
      {
        source: '/api-reference/idempotency-key',
        destination: '/api-reference/get-started/idempotency-key',
        permanent: true,
      },
      {
        source: '/api-reference/postman-collections',
        destination: '/api-reference/get-started/postman-collections',
        permanent: true,
      },
      // API Reference restructure: endpoint pages (one redirect per resource)
      ...[
        'adjustments', 'applepaysessions', 'authenticationsessions',
        'authenticationsessionsindependent', 'cashflow', 'charges', 'checkout',
        'collaborations', 'customers', 'disputes', 'documents', 'exchangerates',
        'fraudwarnings', 'holds', 'merchants', 'networktokens', 'partialapproval',
        'paymentattempts', 'paymentlinks', 'paymentmethoddomains', 'paymentmethods',
        'paymentsessions', 'payouts', 'reconciliation', 'refunds', 'riskassessment',
        'riskreview', 'servicefees', 'settlements', 'setupattempts', 'setupsessions',
        'subscriptionpackages', 'subscriptions', 'tokenizationsessions', 'tokens',
        'transactionstatus', 'valuelists',
      ].map((endpoint) => ({
        source: `/api-reference/${endpoint}/:path*`,
        destination: `/api-reference/endpoints/${endpoint}/:path*`,
        permanent: true,
      })),
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
      // Merged transaction concept pages
      {
        source: '/documentation/paycom-concepts/charges',
        destination: '/documentation/paycom-concepts/transactions',
        permanent: true,
      },
      {
        source: '/documentation/paycom-concepts/holds-and-captures',
        destination: '/documentation/paycom-concepts/transactions',
        permanent: true,
      },
      {
        source: '/documentation/paycom-concepts/refunds',
        destination: '/documentation/paycom-concepts/transactions',
        permanent: true,
      },
      {
        source: '/documentation/paycom-concepts/payouts',
        destination: '/documentation/paycom-concepts/transactions',
        permanent: true,
      },
      {
        source: '/documentation/paycom-concepts/3d-secure',
        destination: '/documentation/paycom-concepts/transactions',
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
