import { DiagramViewer } from './DiagramViewer'
import registry from './registry.json'

const { title, description } = registry['3ds-auth-flow']

export function ThreeDsAuthFlow() {
  return (
    <DiagramViewer title={title} description={description}>
      <div
        style={{
          position: 'relative',
          width: 900,
          height: 874,
          background: '#f8fafc',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ─── SVG layer: diamonds, paths, sparks ───────────────── */}
        <svg
          style={{ position: 'absolute', inset: 0, width: 900, height: 874, pointerEvents: 'none' }}
          viewBox="0 0 900 874"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="tds-card-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="8" floodColor="rgba(0,0,0,0.08)" />
            </filter>
            <marker id="tds-arr" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
              <path d="M0,0.5 L0,5.5 L6,3 z" fill="#94a3b8" />
            </marker>
            <filter id="tds-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="tds-clip">
              <rect x="40" y="48" width="820" height="778" rx="10" />
            </clipPath>
          </defs>

          {/* Title */}
          <text x="450" y="32" textAnchor="middle"
            fontFamily="Inter,sans-serif" fontSize="12" fontWeight="600"
            fill="#94a3b8" letterSpacing="2">
            3DS AUTHENTICATION FLOW
          </text>

          {/* White card — no dashed grid */}
          <rect x="40" y="48" width="820" height="778" rx="10"
            fill="#ffffff" filter="url(#tds-card-shadow)" />

          {/* ── Decision diamond: Step2  cx=450 cy=210 hw=120 hh=42 ── */}
          <polygon points="450,168 570,210 450,252 330,210"
            fill="#fefce8" stroke="#d97706" strokeWidth="1.5" />
          <text textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="600" fill="#1c1917">
            <tspan x="450" y="205">2. Check the</tspan>
            <tspan x="450" dy="15">status</tspan>
          </text>

          {/* ── Decision diamond: Step4  cx=450 cy=540 hw=148 hh=44 ── */}
          <polygon points="450,496 598,540 450,584 302,540"
            fill="#fefce8" stroke="#d97706" strokeWidth="1.5" />
          <text textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="600" fill="#1c1917">
            <tspan x="450" y="534">4. Confirm the payment</tspan>
            <tspan x="450" dy="15">(confirm parameter)</tspan>
          </text>

          {/* ── Connector paths ──────────────────────────────────────── */}
          {/* p1: Step1 → Step2 */}
          <path id="tds-p1" d="M 450,113 L 450,168"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* pend1: Step2 right → End1 */}
          <path id="tds-pend1" d="M 570,210 L 670,210"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p3: Step2 bottom → Step3 */}
          <path id="tds-p3" d="M 450,252 L 450,285"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p4: Step3 → Bank */}
          <path id="tds-p4" d="M 450,353 L 450,385"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p5: Bank → Step4 */}
          <path id="tds-p5" d="M 450,435 L 450,496"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p6: Step4 left → PathTrue */}
          <path id="tds-p6" d="M 302,540 C 190,540 160,585 160,618"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p7: Step4 right → PathFalseWait  (cx shifted to 718) */}
          <path id="tds-p7" d="M 598,540 C 710,540 718,585 718,618"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p8: PathFalseWait → PathFalseAPI */}
          <path id="tds-p8" d="M 718,668 L 718,726"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p9: PathTrue → End2 */}
          <path id="tds-p9" d="M 160,672 C 160,760 340,825 363,825"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />
          {/* p10: PathFalseAPI → End2 */}
          <path id="tds-p10" d="M 718,780 C 718,820 600,825 538,825"
            stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#tds-arr)" />

          {/* ── Animated sparks ──────────────────────────────────────── */}
          <g clipPath="url(#tds-clip)">
            <circle r="3.5" fill="#2563eb" filter="url(#tds-glow)" opacity="0.9">
              <animateMotion dur="0.8s" begin="0s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p1" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#16a34a" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="1.7s" begin="0.4s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-pend1" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="#2563eb" filter="url(#tds-glow)" opacity="0.9">
              <animateMotion dur="0.5s" begin="0.7s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p3" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#ea580c" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="0.5s" begin="1.0s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p4" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="#2563eb" filter="url(#tds-glow)" opacity="0.9">
              <animateMotion dur="0.9s" begin="1.3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p5" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#16a34a" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="1.5s" begin="1.6s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p6" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#2563eb" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="1.5s" begin="2.0s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p7" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#2563eb" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="0.9s" begin="2.4s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p8" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#16a34a" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="2.2s" begin="2.2s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p9" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#16a34a" filter="url(#tds-glow)" opacity="0.85">
              <animateMotion dur="2.0s" begin="2.7s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#tds-p10" />
              </animateMotion>
            </circle>
          </g>
        </svg>

        {/* ─── HTML nodes ────────────────────────────────────────── */}

        {/* Step 1 */}
        <Node color="blue" cx={450} top={57} width={240} height={56}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>1. Initiate the transaction</span>
          <Mono color="blue">POST /v1/charges or /v1/holds</Mono>
        </Node>

        {/* End 1 */}
        <Node color="green" cx={750} top={192} width={160} height={36} pill>
          Transaction finalized
        </Node>

        {/* Step 3 — wider to fit the long endpoint */}
        <Node color="blue" cx={450} top={285} width={295} height={68}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>3. Create an authentication session</span>
          <Mono color="blue">POST /v1/sessions/authentication/linked</Mono>
        </Node>

        {/* Bank */}
        <Node color="orange" cx={450} top={385} width={260} height={50}>
          <span style={{ fontSize: 13 }}>Customer completes 3DS challenge on Bank URL</span>
        </Node>

        {/* PathTrue */}
        <Node color="green" cx={160} top={618} width={210} height={54}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Pay.com auto-authorizes</span>
          <span style={{ fontSize: 11, color: '#15803d' }}>Notifies via webhooks</span>
        </Node>

        {/* PathFalseWait — cx shifted to 718 */}
        <Node color="blue" cx={718} top={618} width={225} height={50}>
          <span style={{ fontSize: 13 }}>Wait for customer redirect to your site</span>
        </Node>

        {/* PathFalseAPI — cx shifted to 718, wider to fit both endpoints */}
        <Node color="blue" cx={718} top={726} width={280} height={54}>
          <Mono color="blue">POST /v1/charges/{'{'+'charge_id}'}/confirm</Mono>
          <Mono color="blue">or /v1/holds/{'{'+'hold_id}'}/confirm</Mono>
        </Node>

        {/* End 2 */}
        <Node color="green" cx={450} top={806} width={175} height={38} pill>
          Transaction finalized
        </Node>

        {/* ─── Edge labels — positioned beside arrows, not on them ── */}
        {/* p1 (vertical x=450): label to the right */}
        <EdgeLabel cx={522} top={128}>includes auth_context</EdgeLabel>
        {/* pend1 (horizontal y=210): label above the line */}
        <EdgeLabel cx={618} top={191}>succeeded / failed</EdgeLabel>
        {/* p3 (vertical x=450): label to the right */}
        <EdgeLabel cx={524} top={256}>requires_authentication</EdgeLabel>
        {/* p4 (vertical x=450): label to the right */}
        <EdgeLabel cx={524} top={360}>redirect to bank URL</EdgeLabel>
        {/* p6 (curve going left): label above the bend */}
        <EdgeLabel cx={196} top={548}>confirm: true</EdgeLabel>
        {/* p7 (curve going right): label above the bend */}
        <EdgeLabel cx={680} top={548}>confirm: false</EdgeLabel>
        {/* p8 (vertical x=718): label to the right */}
        <EdgeLabel cx={786} top={690}>manual trigger</EdgeLabel>
      </div>
    </DiagramViewer>
  )
}

// ── Small helpers to keep the JSX above readable ─────────────────

type Color = 'blue' | 'green' | 'orange'

const colorMap: Record<Color, { border: string; background: string }> = {
  blue:   { border: '#2563eb', background: '#eff6ff' },
  green:  { border: '#16a34a', background: '#f0fdf4' },
  orange: { border: '#ea580c', background: '#fff7ed' },
}

function Node({
  children, color, cx, top, width, height, pill,
}: {
  children: React.ReactNode
  color: Color
  cx: number
  top: number
  width: number
  height: number
  pill?: boolean
}) {
  const { border, background } = colorMap[color]
  return (
    <div style={{
      position: 'absolute',
      left: cx,
      top,
      width,
      height,
      transform: 'translateX(-50%)',
      border: `1px solid ${border}`,
      borderRadius: pill ? 999 : 6,
      background,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      padding: '8px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      textAlign: 'center',
      lineHeight: 1.5,
      fontWeight: pill ? 600 : 500,
      fontSize: pill ? 14 : 13,
      color: '#0a0a0a',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

function Mono({ children, color }: { children: React.ReactNode; color: Color }) {
  return (
    <span style={{
      fontSize: 11,
      fontFamily: "'Courier New', monospace",
      fontWeight: 400,
      color: color === 'blue' ? '#2563eb' : color === 'green' ? '#15803d' : '#ea580c',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// Plain text label — no opaque background so it never covers arrow lines
function EdgeLabel({ children, cx, top }: { children: React.ReactNode; cx: number; top: number }) {
  return (
    <div style={{
      position: 'absolute',
      left: cx,
      top,
      transform: 'translateX(-50%)',
      fontSize: 11,
      fontWeight: 500,
      color: '#64748b',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </div>
  )
}
