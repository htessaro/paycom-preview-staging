'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Bell, Braces, FlaskConical } from 'lucide-react';
import type { ReactNode } from 'react';

const sections = [
  { text: 'Get started', url: '/api-reference/get-started', icon: Rocket },
  { text: 'Webhooks', url: '/api-reference/webhooks', icon: Bell },
  { text: 'Endpoints', url: '/api-reference/endpoints', icon: Braces },
  { text: 'Developer resources', url: '/api-reference/reference', icon: FlaskConical },
];

export function ApiReferenceSectionsBanner({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();

  if (!pathname.startsWith('/api-reference')) {
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
