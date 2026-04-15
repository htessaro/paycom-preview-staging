'use client';

import React, { useState } from 'react';

type StateColor = 'success' | 'error' | 'warning' | 'neutral';

interface StateNode {
  id: string;
  color?: StateColor;
  description?: string;
}

interface Transition {
  from: string;
  to: string;
  label: string;
}

interface StatusFlowProps {
  states: StateNode[];
  transitions: Transition[];
}

const colorMap: Record<StateColor, { bg: string; border: string; text: string; dot: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-800 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  neutral: {
    bg: 'bg-fd-muted/30',
    border: 'border-fd-border',
    text: 'text-fd-foreground',
    dot: 'bg-fd-muted-foreground',
  },
};

const startStyle = {
  bg: 'bg-fd-muted/20',
  border: 'border-fd-border',
  text: 'text-fd-muted-foreground',
  dot: 'bg-fd-muted-foreground',
};

function StateBadge({ id, states }: { id: string; states: StateNode[] }) {
  const isStart = id === '[*]';
  const node = states.find(s => s.id === id);
  const c = isStart ? startStyle : colorMap[node?.color ?? 'neutral'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-medium whitespace-nowrap ${c.bg} ${c.border} ${c.text}`}
      title={node?.description}
    >
      <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
      {isStart ? 'start' : id}
    </span>
  );
}

export function StatusFlow({ states, transitions }: StatusFlowProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card overflow-hidden">
      {/* Legend header */}
      <div className="flex flex-wrap gap-2 border-b border-fd-border bg-fd-muted/20 px-4 py-3">
        {states.map(node => {
          const c = colorMap[node.color ?? 'neutral'];
          return (
            <span
              key={node.id}
              className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-medium ${c.bg} ${c.border} ${c.text}`}
              title={node.description}
            >
              <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
              {node.id}
            </span>
          );
        })}
      </div>

      {/* Transition rows */}
      <div>
        {transitions.map((t, i) => {
          const isActive = hoveredRow === i;
          const isDim = hoveredRow !== null && !isActive;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 border-fd-border transition-colors duration-100 cursor-default ${
                isActive ? 'bg-fd-muted/50' : isDim ? 'opacity-40' : 'hover:bg-fd-muted/20'
              }`}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <StateBadge id={t.from} states={states} />

              {/* Arrow */}
              <span className="flex items-center text-fd-muted-foreground shrink-0">
                <svg width="28" height="10" viewBox="0 0 28 10" className="overflow-visible">
                  <line x1="0" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <polyline points="18,2 23,5 18,8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>

              <StateBadge id={t.to} states={states} />

              <span className="text-xs text-fd-muted-foreground italic ml-1">{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
