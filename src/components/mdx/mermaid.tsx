'use client';

import { useEffect, useRef, useState } from 'react';

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const id = useRef(`mermaid-${counter++}`);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      const isDark = document.documentElement.classList.contains('dark');

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        fontFamily: 'inherit',
      });

      try {
        const result = await mermaid.render(id.current, chart);
        if (!cancelled) setSvg(result.svg);
      } catch (e) {
        console.error('Mermaid render error:', e);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (!svg) return null;

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
