import { getLLMText, source } from '@/lib/source';

// cached forever
export const revalidate = false;

const PREAMBLE = `# Pay.com API Documentation — Full Text

> This file contains the complete text of all Pay.com documentation pages.
> To read any individual page as Markdown, append .md to its URL (e.g. /documentation/introduction/getting-started.md).
>
> Note: API reference entries below contain brief descriptions only. The API
> reference is generated from an OpenAPI specification — for full endpoint schemas,
> request/response bodies, and parameter details, fetch any API reference page as
> Markdown by appending .md to its URL (e.g. /api-reference/charges/create-charge.md).`;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response([PREAMBLE, ...scanned].join('\n\n'));
}
