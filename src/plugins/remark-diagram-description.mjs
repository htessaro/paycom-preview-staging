import { visit } from 'unist-util-visit'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load registry once at build time
const registry = JSON.parse(
  readFileSync(join(process.cwd(), 'src/components/diagrams/registry.json'), 'utf-8')
)

/**
 * remarkDiagramDescription
 *
 * Finds every <Diagram id="..." /> JSX node in the MDX AST and injects
 * the diagram's description as a plain paragraph immediately after it.
 *
 * The paragraph is visually hidden via CSS but:
 *   - Appears in the raw .md / llms.txt output Fumadocs generates
 *   - Is readable by LLMs, search engines, and screen readers
 *   - Keeps description colocated with diagram config (registry.json)
 *     rather than scattered across MDX files
 */
export function remarkDiagramDescription() {
  return (tree) => {
    const insertions = []

    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name !== 'Diagram') return

      // Read the id attribute value
      const idAttr = node.attributes?.find(
        (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'id'
      )
      if (!idAttr) return

      const id = idAttr.value
      const entry = registry[id]
      if (!entry?.description) return

      insertions.push({ parent, index, id, entry })
    })

    // Process in reverse order so splices don't shift earlier indices
    for (const { parent, index, entry } of insertions.reverse()) {
      parent.children.splice(index + 1, 0, {
        type: 'mdxJsxFlowElement',
        name: 'p',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'data-diagram-description',
            value: 'true',
          },
          {
            type: 'mdxJsxAttribute',
            name: 'className',
            value: 'sr-only',
          },
        ],
        children: [{ type: 'text', value: entry.description }],
      })
    }
  }
}
