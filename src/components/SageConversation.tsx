import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { sage, SECTORS, type CompleteResp, type VisitorInfo } from '@/lib/sage'

type Phase = 'intro' | 'chat' | 'loading' | 'results'
interface Msg { role: 'sage' | 'you'; text: string }

export function SageConversation() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [info, setInfo] = useState<VisitorInfo>({ name: '', company: '', sector: '', location: '', email: '' })
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CompleteResp | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])

  const introReady = info.name && info.company && info.sector && info.location

  async function start() {
    if (!introReady || busy) return
    setBusy(true); setError(null)
    try {
      const r = await sage.start(info)
      setSessionId(r.session_id)
      setMsgs([{ role: 'sage', text: r.first_question }])
      setPhase('chat')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function send() {
    if (!sessionId || !input.trim() || busy) return
    const answer = input.trim()
    setInput(''); setError(null)
    setMsgs(m => [...m, { role: 'you', text: answer }])
    setBusy(true)
    try {
      const r = await sage.message(sessionId, answer)
      if (r.next_question) setMsgs(m => [...m, { role: 'sage', text: r.next_question as string }])
      if (r.is_complete) await complete()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function complete() {
    if (!sessionId) return
    setPhase('loading')
    try {
      const r = await sage.complete(sessionId)
      setResult(r)
      setPhase('results')
    } catch (e) {
      setError((e as Error).message)
      setPhase('chat')
    }
  }

  async function pay() {
    if (!sessionId) return
    setBusy(true)
    try {
      const r = await sage.pay(sessionId)
      window.location.href = r.checkout_url
    } catch (e) {
      setError((e as Error).message); setBusy(false)
    }
  }

  async function book() {
    if (!sessionId) return
    setBusy(true); setError(null)
    try {
      await sage.bookCall(sessionId)
      setMsgs(m => [...m, { role: 'sage', text: "Booked — Cy has your full diagnostic and will be in touch shortly." }])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const Nav = () => (
    <header style={navStyle}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: '1rem', color: '#F1F5F9', letterSpacing: '-0.02em' }}>ScaleSage</Link>
      <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00E5C3', fontWeight: 500 }}>Sage</span>
      <Link to="/" style={{ fontSize: '0.8rem', color: 'rgba(241,245,249,0.4)', textDecoration: 'none' }}>← Back</Link>
    </header>
  )

  const ErrorNote = () =>
    error ? <p style={{ color: '#FF4D6D', fontSize: '0.8rem', marginTop: '0.75rem' }}>{error}</p> : null

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ background: '#0B1D3A', minHeight: '100vh' }}>
        <Nav />
        <div style={pageWrap}>
          <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem', textAlign: 'center' }}>Meet Sage</p>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem', color: '#F1F5F9', textAlign: 'center' }}>
              A real diagnosis,<br /><span style={{ color: '#00E5C3' }}>in a conversation.</span>
            </h1>
            <p style={{ color: 'rgba(241,245,249,0.6)', fontSize: '0.95rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '2rem' }}>
              A few details, then Sage asks 5–8 sharp questions and builds your personalised diagnostic.
            </p>
            <div style={cardStyle}>
              <input placeholder="Your name *" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} style={inputStyle} />
              <input placeholder="Business name *" value={info.company} onChange={e => setInfo({ ...info, company: e.target.value })} style={{ ...inputStyle, marginTop: '0.65rem' }} />
              <select value={info.sector} onChange={e => setInfo({ ...info, sector: e.target.value })} style={{ ...inputStyle, marginTop: '0.65rem' }}>
                <option value="">Select your sector *</option>
                {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <input placeholder="Location (e.g. Leeds, UK) *" value={info.location} onChange={e => setInfo({ ...info, location: e.target.value })} style={{ ...inputStyle, marginTop: '0.65rem' }} />
              <input type="email" placeholder="Email (optional)" value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} style={{ ...inputStyle, marginTop: '0.65rem' }} />
              <button className="btn-primary" onClick={start} disabled={!introReady || busy}
                style={{ marginTop: '1.1rem', width: '100%', padding: '0.9rem', fontSize: '0.9rem', opacity: (!introReady || busy) ? 0.5 : 1, cursor: (!introReady || busy) ? 'not-allowed' : 'pointer' }}>
                {busy ? 'Starting…' : 'Begin diagnosis →'}
              </button>
              <ErrorNote />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div style={{ background: '#0B1D3A', minHeight: '100vh' }}>
        <Nav />
        <div style={pageWrap}>
          <div style={{ textAlign: 'center', color: 'rgba(241,245,249,0.7)' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00E5C3', marginBottom: '0.75rem' }}>Building your diagnostic</div>
            <p style={{ fontSize: '0.95rem' }}>Analysing your answers, scoring AI visibility, and cross-checking recommendations…</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results' && result) {
    const d = result.diagnostic
    return (
      <div style={{ background: '#0B1D3A', minHeight: '100vh' }}>
        <Nav />
        <div style={{ ...pageWrap, paddingTop: '7rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Your Catalyst Diagnostic</p>
            {d.executive_summary && (
              <p style={{ color: 'rgba(241,245,249,0.75)', fontSize: '0.98rem', lineHeight: 1.7, textAlign: 'center', maxWidth: 560, margin: '0 auto 2rem' }}>{d.executive_summary}</p>
            )}

            {typeof d.ai_visibility_score === 'number' && (
              <div style={{ ...panelStyle, textAlign: 'center' }}>
                <p style={panelLabel}>AI visibility score</p>
                <div style={{ fontSize: 'clamp(3rem, 9vw, 5rem)', fontWeight: 700, color: '#00E5C3', lineHeight: 1, letterSpacing: '-0.04em' }}>{d.ai_visibility_score}<span style={{ fontSize: '1.5rem', color: 'rgba(241,245,249,0.4)' }}>/100</span></div>
                {d.ai_visibility_reasoning && <p style={{ color: 'rgba(241,245,249,0.55)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.75rem' }}>{d.ai_visibility_reasoning}</p>}
              </div>
            )}

            <ResultList title="Top revenue leaks" items={d.revenue_leaks} tone="leak" />
            <ResultList title="Biggest opportunities" items={result.recommendations?.length ? result.recommendations : d.opportunities} tone="opp" />

            {(result.tier ?? d.recommended_tier) && (
              <div style={{ ...panelStyle, borderColor: 'rgba(0,229,195,0.25)', background: 'rgba(0,229,195,0.06)' }}>
                <p style={{ ...panelLabel, color: '#00E5C3' }}>Recommended tier</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F1F5F9', textTransform: 'capitalize', marginBottom: '0.25rem' }}>{result.tier ?? d.recommended_tier}</p>
                {d.tier_reasoning && <p style={{ color: 'rgba(241,245,249,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>{d.tier_reasoning}</p>}
              </div>
            )}

            <ResultList title="Recommended bolt-ons" items={result.bolt_ons?.length ? result.bolt_ons : d.bolt_ons} tone="opp" />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button className="btn-primary" style={{ fontSize: '0.9rem' }} onClick={pay} disabled={busy}>Pay &amp; get started →</button>
              <button className="btn-secondary" style={{ fontSize: '0.9rem' }} onClick={book} disabled={busy}>Book a call with Cy</button>
            </div>
            <ErrorNote />
          </div>
        </div>
      </div>
    )
  }

  // ── Chat ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#0B1D3A', minHeight: '100vh' }}>
      <Nav />
      <div style={{ ...pageWrap, paddingTop: '6rem' }}>
        <div style={{ ...cardStyle, maxWidth: 680, display: 'flex', flexDirection: 'column', height: '70vh', padding: 0 }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'you' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '0.7rem 1rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.55,
                  background: m.role === 'you' ? 'rgba(0,229,195,0.12)' : 'rgba(17,24,39,0.55)',
                  border: m.role === 'you' ? '1px solid rgba(0,229,195,0.25)' : '1px solid rgba(241,245,249,0.08)',
                  color: m.role === 'you' ? '#F1F5F9' : 'rgba(241,245,249,0.85)',
                }}>{m.text}</div>
              </div>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', color: 'rgba(241,245,249,0.4)', fontSize: '0.85rem', fontStyle: 'italic' }}>Sage is thinking…</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', padding: '1rem', borderTop: '1px solid rgba(241,245,249,0.08)' }}>
            <input
              placeholder="Type your answer…"
              value={input}
              disabled={busy}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button className="btn-primary" onClick={send} disabled={busy || !input.trim()} style={{ padding: '0 1.3rem', fontSize: '0.9rem', opacity: (busy || !input.trim()) ? 0.5 : 1 }}>Send</button>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: '0.75rem auto 0' }}><ErrorNote /></div>
      </div>
    </div>
  )
}

function ResultList({ title, items, tone }: { title: string; items?: string[]; tone: 'leak' | 'opp' }) {
  if (!items || items.length === 0) return null
  const accent = tone === 'leak' ? 'rgba(255,77,109,0.5)' : 'rgba(0,229,195,0.5)'
  const bg = tone === 'leak' ? 'rgba(255,77,109,0.05)' : 'rgba(0,229,195,0.05)'
  const border = tone === 'leak' ? 'rgba(255,77,109,0.15)' : 'rgba(0,229,195,0.15)'
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={panelLabel}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}`, borderRadius: '10px', padding: '0.9rem 1.2rem', color: 'rgba(241,245,249,0.8)', fontSize: '0.88rem', lineHeight: 1.6 }}>{it}</div>
        ))}
      </div>
    </div>
  )
}

const navStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '1.1rem 1.5rem', background: 'rgba(11,29,58,0.92)', backdropFilter: 'blur(8px)',
  borderBottom: '1px solid rgba(241,245,249,0.06)',
}

const pageWrap: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  padding: '7rem 1.25rem 4rem',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(13,31,60,0.7)', border: '1px solid rgba(241,245,249,0.08)',
  borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(12px)', width: '100%', margin: '0 auto',
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(13,31,60,0.65)', border: '1px solid rgba(241,245,249,0.08)',
  borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(10px)',
}

const panelLabel: React.CSSProperties = {
  fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'rgba(241,245,249,0.4)', marginBottom: '1rem', fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(11,29,58,0.6)', border: '1.5px solid rgba(241,245,249,0.12)',
  borderRadius: '8px', padding: '0.8rem 1rem', color: '#F1F5F9', fontSize: '0.9rem',
  outline: 'none', boxSizing: 'border-box',
}
