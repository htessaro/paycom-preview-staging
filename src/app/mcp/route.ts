import { createMCPHandler } from '@writechoice/fumadocs-mcp';
import { source } from '@/lib/source';

export const { GET, POST, OPTIONS } = createMCPHandler(source, {
  server: { name: 'Pay.com Docs', version: '1.0.0' },
});
