import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { APIPage } from '@/components/api-page';
import { Mermaid } from '@/components/mdx/mermaid';
import { StatusFlow } from '@/components/mdx/status-flow';
import { SequenceFlow } from '@/components/mdx/sequence-flow';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Diagram } from '@/components/diagrams';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    APIPage,
    Mermaid,
    StatusFlow,
    SequenceFlow,
    Diagram,
    ...components,
  };
}
