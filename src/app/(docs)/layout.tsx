import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { DocumentationSectionsBanner } from '@/components/docs/documentation-sections';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      nav={{ ...base.nav, mode: 'top' }}
      tabMode="navbar"
      sidebar={{
        tabs: [
          {
            title: 'Documentation',
            url: '/documentation/introduction',
            urls: new Set([
              '/documentation/introduction',
              '/documentation/paycom-concepts',
              '/documentation/payments',
              '/documentation/payment-methods',
              '/documentation/orchestration',
              '/documentation/risk-disputes-fraud',
              '/documentation/reporting-reconciliation',
            ]),
          },
          { title: 'API Reference', url: '/api-reference' },
          { title: 'SDK Reference', url: '/sdk-reference' },
          { title: 'Changelog', url: '/changelog' },
        ],
        banner: DocumentationSectionsBanner,
      }}
    >
      {children}
    </DocsLayout>
  );
}
