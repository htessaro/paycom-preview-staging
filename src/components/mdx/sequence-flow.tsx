'use client';

import React, { useState } from 'react';

interface Actor {
  id: string;
  label: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'neutral';
}

interface Message {
  from: string;
  to: string;
  label: string;
  style?: 'solid' | 'dashed';
  note?: string;
  group?: string;
}

interface SequenceFlowProps {
  actors: Actor[];
  messages: Message[];
}

const actorColors: Record<string, { header: string; line: string; text: string }> = {
  blue: {
    header: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-950/50 dark:border-blue-700 dark:text-blue-300',
    line: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    header: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-950/50 dark:border-purple-700 dark:text-purple-300',
    line: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
  },
  green: {
    header: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-950/50 dark:border-green-700 dark:text-green-300',
    line: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400',
  },
  orange: {
    header: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-950/50 dark:border-orange-700 dark:text-orange-300',
    line: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
  },
  neutral: {
    header: 'bg-fd-muted border-fd-border text-fd-foreground',
    line: 'border-fd-border',
    text: 'text-fd-muted-foreground',
  },
};

export function SequenceFlow({ actors, messages }: SequenceFlowProps) {
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);

  const getActorIndex = (id: string) => actors.findIndex(a => a.id === id);
  const getColor = (id: string) => actorColors[actors.find(a => a.id === id)?.color ?? 'neutral'];

  // Group consecutive messages with same group label
  const groupedMessages: { group?: string; messages: (Message & { originalIndex: number })[] }[] = [];
  messages.forEach((msg, i) => {
    const last = groupedMessages[groupedMessages.length - 1];
    if (msg.group && last && last.group === msg.group) {
      last.messages.push({ ...msg, originalIndex: i });
    } else {
      groupedMessages.push({ group: msg.group, messages: [{ ...msg, originalIndex: i }] });
    }
  });

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card overflow-x-auto">
      <div className="min-w-[520px]">
        {/* Actor headers */}
        <div
          className="grid border-b border-fd-border"
          style={{ gridTemplateColumns: `repeat(${actors.length}, 1fr)` }}
        >
          {actors.map(actor => {
            const c = actorColors[actor.color ?? 'neutral'];
            return (
              <div
                key={actor.id}
                className={`border-r last:border-r-0 border-fd-border px-3 py-3 text-center text-xs font-semibold ${c.header}`}
              >
                {actor.label}
              </div>
            );
          })}
        </div>

        {/* Message rows */}
        <div className="relative">
          {groupedMessages.map((group, gi) => (
            <React.Fragment key={gi}>
              {group.group && (
                <div className="mx-2 mt-2 mb-0 rounded-t-md border border-b-0 border-fd-border bg-fd-muted/30 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
                  {group.group}
                </div>
              )}
              <div className={group.group ? 'border-x border-fd-border mx-2 mb-2 rounded-b-md overflow-hidden' : ''}>
                {group.messages.map(msg => {
                  const fromIdx = getActorIndex(msg.from);
                  const toIdx = getActorIndex(msg.to);
                  const isActive = hoveredMsg === msg.originalIndex;
                  const goesRight = toIdx > fromIdx;
                  const fromCol = Math.min(fromIdx, toIdx);
                  const toCol = Math.max(fromIdx, toIdx);
                  const colWidth = 100 / actors.length;

                  const arrowStartPct = fromIdx * colWidth + colWidth / 2;
                  const arrowEndPct = toIdx * colWidth + colWidth / 2;

                  return (
                    <div key={msg.originalIndex}>
                      {msg.note && (
                        <div
                          className="mx-4 my-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs text-amber-800 dark:text-amber-300 italic"
                          style={{ marginLeft: `${arrowStartPct}%`, width: 'fit-content', maxWidth: '60%' }}
                        >
                          {msg.note}
                        </div>
                      )}
                      <div
                        className={`relative flex items-center transition-colors duration-100 cursor-default ${
                          isActive ? 'bg-fd-muted/60' : 'hover:bg-fd-muted/30'
                        }`}
                        style={{ height: '2.5rem' }}
                        onMouseEnter={() => setHoveredMsg(msg.originalIndex)}
                        onMouseLeave={() => setHoveredMsg(null)}
                      >
                        {/* Vertical lifelines */}
                        {actors.map((actor, ai) => (
                          <div
                            key={actor.id}
                            className={`absolute top-0 bottom-0 border-l ${getColor(actor.id).line}`}
                            style={{
                              left: `${ai * colWidth + colWidth / 2}%`,
                              borderLeftStyle: 'dashed',
                            }}
                          />
                        ))}

                        {/* Arrow */}
                        <div
                          className="absolute flex items-center"
                          style={{
                            left: `${Math.min(arrowStartPct, arrowEndPct)}%`,
                            width: `${Math.abs(arrowEndPct - arrowStartPct)}%`,
                          }}
                        >
                          <div
                            className={`w-full border-t transition-colors ${
                              isActive ? 'border-fd-foreground' : 'border-fd-muted-foreground/60'
                            }`}
                            style={{ borderTopStyle: msg.style === 'dashed' ? 'dashed' : 'solid' }}
                          />
                          {/* Arrowhead */}
                          <div
                            className={`absolute ${goesRight ? 'right-0' : 'left-0'} transition-colors ${
                              isActive ? 'text-fd-foreground' : 'text-fd-muted-foreground/60'
                            }`}
                            style={{ transform: goesRight ? 'none' : 'scaleX(-1)' }}
                          >
                            <svg width="8" height="10" viewBox="0 0 8 10">
                              <polyline points="0,1 7,5 0,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>

                        {/* Label */}
                        <div
                          className={`absolute z-10 px-1.5 py-0.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-fd-card border border-fd-border text-fd-foreground shadow-sm'
                              : 'text-fd-muted-foreground'
                          }`}
                          style={{
                            left: `${(arrowStartPct + arrowEndPct) / 2}%`,
                            transform: 'translateX(-50%)',
                            top: '2px',
                            fontFamily: 'monospace',
                            fontSize: '0.68rem',
                          }}
                        >
                          {msg.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Actor footers */}
        <div
          className="grid border-t border-fd-border"
          style={{ gridTemplateColumns: `repeat(${actors.length}, 1fr)` }}
        >
          {actors.map(actor => {
            const c = actorColors[actor.color ?? 'neutral'];
            return (
              <div
                key={actor.id}
                className={`border-r last:border-r-0 border-fd-border px-3 py-2 text-center text-xs font-semibold ${c.header}`}
              >
                {actor.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
