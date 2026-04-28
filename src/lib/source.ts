import { readFileSync } from 'fs';
import { join } from 'path';
import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin } from 'fumadocs-openapi/server';


// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

interface FailureCode {
  errorCode: string;
  endUserMessage: string;
  dashboardMessage: string;
  description: string;
  fallbackable: boolean;
  internal: boolean;
}

function buildFailureCodesMarkdown(): string {
  const raw = readFileSync(
    join(process.cwd(), 'src/data/failure-codes.json'),
    'utf-8',
  );
  const { failureCodeMessages } = JSON.parse(raw) as {
    failureCodeMessages: FailureCode[];
  };
  const visible = failureCodeMessages.filter((c) => !c.internal);
  const header =
    '| Code | Dashboard message | End-user message | Description | Fallbackable |';
  const sep = '| :--- | :--- | :--- | :--- | :--- |';
  const rows = visible.map(
    (c) =>
      `| \`${c.errorCode}\` | ${c.dashboardMessage} | ${c.endUserMessage} | ${c.description.replace(/\n/g, ' ')} | ${c.fallbackable ? 'Yes' : 'No'} |`,
  );
  return `## All error codes\n\n${header}\n${sep}\n${rows.join('\n')}`;
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  const suffix = page.slugs.includes('failure-codes')
    ? `\n\n${buildFailureCodesMarkdown()}`
    : '';

  return `# ${page.data.title} (${page.url})

${processed}${suffix}`;
}
