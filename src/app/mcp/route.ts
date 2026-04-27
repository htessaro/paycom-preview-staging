import { createFromSource } from 'fumadocs-core/search/server';
import { getLLMText, source } from '@/lib/source';

// Singleton — same index as /api/search, initialised once per process
const searchIndex = createFromSource(source, { language: 'english' });

const SERVER_INFO = {
  name: 'fumadocs-mcp',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
};

const TOOLS = [
  {
    name: 'list_docs',
    description:
      'List all available documentation pages, grouped by section. Returns title, URL, and description for each page.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_doc',
    description:
      'Fetch the full content of one or more documentation pages by their URL path. Accepts a single path string or an array of paths.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          oneOf: [
            { type: 'string', description: 'URL path of the page, e.g. /api-reference/charges/create-charge' },
            {
              type: 'array',
              items: { type: 'string' },
              description: 'Multiple URL paths to fetch at once',
            },
          ],
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'search_docs',
    description:
      'Fast keyword search over page titles and descriptions. Good for finding a specific page by name. Use search_docs_fulltext for body content.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Maximum results to return (default 10)' },
        scoreThreshold: {
          type: 'number',
          description: 'Minimum relevance score 0–1 (default 0.1)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_docs_fulltext',
    description:
      'Full-text search across all documentation content using the Orama index. Searches page bodies, headings, and paragraphs. Use this when search_docs returns no results or you need to find mentions within content.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Maximum results to return (default 10)' },
      },
      required: ['query'],
    },
  },
];

// Converts a URL path like /api-reference/charges/create-charge → ['api-reference', 'charges', 'create-charge']
function pathToSlug(path: string): string[] {
  return path.replace(/^\//, '').split('/').filter(Boolean);
}

async function listDocs() {
  const pages = source.getPages();
  const sections: Record<string, string[]> = {};

  for (const page of pages) {
    const section = page.url.split('/').filter(Boolean)[0] ?? 'root';
    const line = `- ${page.url} — ${page.data.title}${page.data.description ? `: ${page.data.description}` : ''}`;
    (sections[section] ??= []).push(line);
  }

  const output = Object.entries(sections)
    .map(([section, lines]) => `## ${section}\n\n${lines.join('\n')}`)
    .join('\n\n');

  return { type: 'text', text: output };
}

async function getDoc(paths: string | string[]) {
  const pathList = Array.isArray(paths) ? paths : [paths];

  const results = await Promise.all(
    pathList.map(async (p) => {
      const slug = pathToSlug(p);
      const page = source.getPage(slug);
      if (!page) return `<!-- Not found: ${p} -->`;
      return getLLMText(page);
    }),
  );

  return { type: 'text', text: results.join('\n\n---\n\n') };
}

async function searchDocs(
  query: string,
  limit = 10,
  scoreThreshold = 0.1,
) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pages = source.getPages();

  type ScoredPage = { page: (typeof pages)[number]; score: number; snippet: string };
  const scored: ScoredPage[] = [];

  for (const page of pages) {
    const title = (page.data.title ?? '').toLowerCase();
    const desc = (page.data.description ?? '').toLowerCase();

    let raw = 0;
    for (const w of words) {
      const titleCount = (title.match(new RegExp(w, 'g')) ?? []).length;
      const descCount = (desc.match(new RegExp(w, 'g')) ?? []).length;
      raw += titleCount * 3 + descCount * 2;
    }

    if (raw === 0) continue;

    const maxRaw = words.length * 3;
    const score = Math.min(raw / maxRaw, 1);
    if (score < scoreThreshold) continue;

    const snippetSource = page.data.description ?? page.data.title ?? '';
    const snippet = snippetSource.length > 200 ? `${snippetSource.slice(0, 200)}…` : snippetSource;

    scored.push({ page, score, snippet });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  if (top.length === 0) {
    return { type: 'text', text: `No results found for "${query}".` };
  }

  const lines = top.map(
    ({ page, score, snippet }) =>
      `**${page.data.title}** (\`${page.url}\`) [score: ${score.toFixed(2)}]\n${snippet}`,
  );

  return { type: 'text', text: lines.join('\n\n') };
}

type OramaResult = {
  type: 'page' | 'heading' | 'text';
  url: string;
  content: string;
  id: string;
};

async function searchDocsFulltext(query: string, limit = 10) {
  const url = new URL('http://localhost/api/search');
  url.searchParams.set('query', query);

  const res = await searchIndex.GET(new Request(url));
  const raw = (await res.json()) as OramaResult[];
  const results = raw.slice(0, limit);

  if (results.length === 0) {
    return { type: 'text', text: `No results found for "${query}".` };
  }

  // Group consecutive heading/text results under their page
  const lines = results.map((r) => {
    const label = r.type === 'page' ? 'page' : r.type === 'heading' ? 'heading' : 'text';
    return `[${label}] \`${r.url}\`\n${r.content}`;
  });

  return { type: 'text', text: lines.join('\n\n') };
}

async function dispatch(method: string, params: Record<string, unknown>) {
  if (method === 'initialize') {
    return {
      protocolVersion: SERVER_INFO.protocolVersion,
      serverInfo: { name: SERVER_INFO.name, version: SERVER_INFO.version },
      capabilities: { tools: {} },
    };
  }

  if (method === 'ping') return {};

  if (method === 'tools/list') {
    return { tools: TOOLS };
  }

  if (method === 'tools/call') {
    const name = params.name as string;
    const args = (params.arguments ?? {}) as Record<string, unknown>;

    if (name === 'list_docs') {
      const content = await listDocs();
      return { content: [content] };
    }

    if (name === 'get_doc') {
      const content = await getDoc(args.path as string | string[]);
      return { content: [content] };
    }

    if (name === 'search_docs') {
      const content = await searchDocs(
        args.query as string,
        (args.limit as number) ?? 10,
        (args.scoreThreshold as number) ?? 0.1,
      );
      return { content: [content] };
    }

    if (name === 'search_docs_fulltext') {
      const content = await searchDocsFulltext(
        args.query as string,
        (args.limit as number) ?? 10,
      );
      return { content: [content] };
    }

    return jsonRpcError(-32601, `Unknown tool: ${name}`);
  }

  return jsonRpcError(-32601, `Method not found: ${method}`);
}

function jsonRpcError(code: number, message: string) {
  return { error: { code, message } };
}

function jsonRpcResponse(id: unknown, result: unknown) {
  if (result && typeof result === 'object' && 'error' in result) {
    return { jsonrpc: '2.0', id, error: (result as { error: unknown }).error };
  }
  return { jsonrpc: '2.0', id, result };
}

async function handleRequest(body: unknown) {
  if (Array.isArray(body)) {
    const responses = await Promise.all(
      body.map(async (req) => {
        if (!req || typeof req !== 'object' || !('method' in req)) return null;
        const { id, method, params = {} } = req as { id: unknown; method: string; params?: Record<string, unknown> };
        const result = await dispatch(method, params);
        return id !== undefined ? jsonRpcResponse(id, result) : null;
      }),
    );
    return responses.filter(Boolean);
  }

  if (!body || typeof body !== 'object' || !('method' in body)) {
    return jsonRpcError(-32700, 'Parse error');
  }

  const { id, method, params = {} } = body as { id: unknown; method: string; params?: Record<string, unknown> };
  const result = await dispatch(method, params ?? {});
  return id !== undefined ? jsonRpcResponse(id, result) : null;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const pages = source.getPages();
  return Response.json(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocolVersion: SERVER_INFO.protocolVersion,
      endpoint: '/mcp',
      totalDocs: pages.length,
      tools: TOOLS.map((t) => t.name),
    },
    { headers: CORS_HEADERS },
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(jsonRpcError(-32700, 'Parse error'), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const response = await handleRequest(body);

  if (response === null) {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  return Response.json(response, { headers: CORS_HEADERS });
}
