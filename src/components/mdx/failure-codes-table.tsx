'use client';

import React, { useState, useMemo } from 'react';
import failureData from '@/data/failure-codes.json';

interface FailureCode {
  errorCode: string;
  endUserMessage: string;
  dashboardMessage: string;
  description: string;
  fallbackable: boolean;
  internal: boolean;
}

const codes: FailureCode[] = (
  failureData.failureCodeMessages as FailureCode[]
).filter((c) => !c.internal);

export function FailureCodesTable() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return codes;
    return codes.filter(
      (c) =>
        c.errorCode.includes(q) ||
        c.endUserMessage.toLowerCase().includes(q) ||
        c.dashboardMessage.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-3 border-b border-fd-border bg-fd-muted/20 px-4 py-3">
        <input
          type="search"
          placeholder="Search codes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-1 focus:ring-fd-ring"
        />
        <span className="whitespace-nowrap text-xs text-fd-muted-foreground">
          {filtered.length} / {codes.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/10">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Code
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Dashboard message
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                End-user message
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Description
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Fallbackable
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-fd-muted-foreground"
                >
                  No codes match your search.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.errorCode}
                  className="border-b border-fd-border last:border-b-0"
                >
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded bg-fd-muted px-1.5 py-0.5 font-mono text-xs">
                      {c.errorCode}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 align-top text-fd-foreground">
                    {c.dashboardMessage}
                  </td>
                  <td className="px-4 py-2.5 align-top text-fd-muted-foreground">
                    {c.endUserMessage}
                  </td>
                  <td className="px-4 py-2.5 align-top text-fd-muted-foreground">
                    {c.description}
                  </td>
                  <td className="px-4 py-2.5 align-top">
                    {c.fallbackable ? (
                      <span className="inline-flex items-center gap-1 rounded border border-green-300 bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:border-green-700 dark:bg-green-950/40 dark:text-green-300">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded border border-fd-border bg-fd-muted/30 px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
