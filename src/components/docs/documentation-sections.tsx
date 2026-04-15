'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, BookOpen, CreditCard, Lightbulb, Network, ShieldAlert, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

const sections = [
  { text: 'Introduction', url: '/documentation/introduction', icon: BookOpen },
  { text: 'Pay.com Concepts', url: '/documentation/paycom-concepts', icon: Lightbulb },
  { text: 'Payments', url: '/documentation/payments', icon: CreditCard },
  { text: 'Payment Methods', url: '/documentation/payment-methods', icon: Wallet },
  { text: 'Orchestration', url: '/documentation/orchestration', icon: Network },
  { text: 'Risk, Dispute & Fraud', url: '/documentation/risk-disputes-fraud', icon: ShieldAlert },
  { text: 'Reporting & Reconciliation', url: '/documentation/reporting-reconciliation', icon: BarChart },
];

export function DocumentationSectionsBanner({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();

  if (!pathname.startsWith('/documentation')) {
    return <>{children}</>;
  }

  return (
    <div className={['flex flex-col gap-3 p-4 pb-2', className].filter(Boolean).join(' ')}>
      {children}
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        {sections.map((section) => {
          const isActive = pathname.startsWith(section.url);
          const Icon = section.icon;
          return (
            <Link
              key={section.url}
              href={section.url}
              className={[
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-fd-primary/10 font-medium text-fd-primary'
                  : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
              ].join(' ')}
            >
              <Icon className="size-4 shrink-0" />
              {section.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
