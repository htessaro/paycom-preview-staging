import { source } from '@/lib/source';

// cached forever
export const revalidate = false;

const SECTION_LABELS: Record<string, string> = {
  documentation: 'Documentation',
  'api-reference': 'API Reference',
  'sdk-reference': 'SDK Reference',
  changelog: 'Changelog',
};

export function GET() {
  const pages = source.getPages();

  // Group pages by first URL segment
  const grouped = new Map<string, typeof pages>();
  for (const page of pages) {
    const segment = page.url.split('/')[1] ?? 'other';
    if (!grouped.has(segment)) grouped.set(segment, []);
    grouped.get(segment)!.push(page);
  }

  const sections: string[] = [];
  for (const [segment, sectionPages] of grouped) {
    const label = SECTION_LABELS[segment] ?? segment;
    const lines = sectionPages.map((p) => {
      const desc = p.data.description ? `: ${p.data.description}` : '';
      return `- [${p.data.title}](${p.url})${desc}`;
    });
    sections.push(`## ${label}\n${lines.join('\n')}`);
  }

  const body = [
    '# Pay.com API Documentation',
    '',
    '> Complete reference for the Pay.com payments API — integration guides, API endpoints, and SDK documentation.',
    '',
    '> Full text of all pages: /llms-full.txt',
    '> To read any page as Markdown, append .md to its URL (e.g. /documentation/introduction/getting-started.md).',
    '',
    sections.join('\n\n'),
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
