import * as OpenAPI from 'fumadocs-openapi';
import { openapi } from '@/lib/openapi';
import fs from 'fs';

const out = './content/docs/api-reference';


async function generate() {
  await OpenAPI.generateFiles({
    input: openapi,
    output: out,
    includeDescription: true,
    groupBy: 'tag',
  });

  // fs.copyFileSync('./content/api-index.mdx', `${out}/index.mdx`);
}

void generate();