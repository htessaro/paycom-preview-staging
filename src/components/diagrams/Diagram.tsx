import { ThreeDsAuthFlow } from './ThreeDsAuthFlow'
// Import new diagram components here as you add them

interface DiagramProps {
  id: string
}

const diagrams: Record<string, React.ComponentType> = {
  '3ds-auth-flow': ThreeDsAuthFlow,
  // 'marketplace-split': MarketplaceSplit,  ← add future diagrams here
}

export function Diagram({ id }: DiagramProps) {
  const Component = diagrams[id]

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{
          border: '2px dashed #f97316',
          borderRadius: 8,
          padding: '16px 20px',
          background: '#fff7ed',
          color: '#9a3412',
          fontFamily: 'monospace',
          fontSize: 13,
        }}>
          ⚠️ No diagram found for id: <strong>{id}</strong>
          <br />
          Check that it is registered in <code>components/diagrams/Diagram.tsx</code>
        </div>
      )
    }
    return null
  }

  return <Component />
}
