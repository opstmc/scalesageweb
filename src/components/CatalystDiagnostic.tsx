import { useState } from 'react'

type Phase = 'intro' | 'questions' | 'gate' | 'results'

interface Answers {
  q1?: string
  q2?: number
  q3?: number
  q4?: number
  q5?: number[]
  q6?: number
  q7?: number
  q8?: number
  q9?: number
  q10?: number
  q11?: number
  q12?: number
  q13?: number
  q14?: number
  teamSize?: string
}

interface GateForm {
  firstName: string
  businessName: string
  email: string
  phone: string
}

const INDUSTRY_OPTIONS = [
  'Trades & construction',
  'Health, wellness & beauty',
  'Hospitality & food',
  'Professional services',
  'Retail & e-commerce',
  'Property & real estate',
  'Education & training',
  'Creative & media',
  'Technology & software',
  'Something else',
]

const TEAM_OPTIONS = ['Just me', '2–5', '6–20', '21–50', '51–200', '200+']

const isSolo = (teamSize?: string) => teamSize === 'Just me'

function calcScore(a: Answers): number {
  // Section 1: Q2, Q3, Q4 (raw max 75 → scaled to 25)
  const q2Scores = [15, 8, 2, 25, 2]
  const q3Scores = [25, 17, 9, 2, 0]
  const q4Scores = [25, 15, 6, 1, 1]
  const s1Raw = (a.q2 != null ? q2Scores[a.q2] : 0)
    + (a.q3 != null ? q3Scores[a.q3] : 0)
    + (a.q4 != null ? q4Scores[a.q4] : 0)
  const s1 = Math.round((s1Raw / 75) * 25)

  // Section 2: Q5 (multi), Q6, Q7 (raw max 70 → scaled to 25)
  const q5Values = [5, 5, 5, 3, -5, 2, 0, 0]
  const q5Raw = a.q5 ? a.q5.reduce((sum, i) => sum + (q5Values[i] ?? 0), 0) : 0
  const q6Scores = [25, 16, 8, 0, 0]
  const q7Scores = [25, 14, 4, 0, 0]
  const s2Raw = Math.max(0, q5Raw) + (a.q6 != null ? q6Scores[a.q6] : 0) + (a.q7 != null ? q7Scores[a.q7] : 0)
  const s2Max = 20 + 25 + 25
  const s2 = Math.round((s2Raw / s2Max) * 25)

  // Section 3: Q8, Q9, Q10 (raw max 75 → scaled to 25, or Q13 replaces 5pts)
  const q8Scores = [25, 15, 8, 1, 0]
  const q9Scores = [25, 17, 9, 2, 0]
  const q10Scores = [25, 17, 9, 2, 0]
  const q13Scores = [20, 13, 5, 0, 3]
  let s3Raw = (a.q8 != null ? q8Scores[a.q8] : 0)
    + (a.q9 != null ? q9Scores[a.q9] : 0)
    + (a.q10 != null ? q10Scores[a.q10] : 0)
  let s3Max = 75
  if (!isSolo(a.teamSize) && a.q13 != null) {
    s3Raw += q13Scores[a.q13]
    s3Max = 95
  }
  const s3 = Math.round((s3Raw / s3Max) * 25)

  // Section 4: Q11, Q12 (raw max 50 → scaled to 25)
  const q11Scores = [25, 16, 8, 2, 0]
  const q12Scores = [25, 17, 9, 2, 2]
  const s4Raw = (a.q11 != null ? q11Scores[a.q11] : 0)
    + (a.q12 != null ? q12Scores[a.q12] : 0)
  const s4 = Math.round((s4Raw / 50) * 25)

  return Math.min(100, s1 + s2 + s3 + s4)
}

function getScoreBand(score: number) {
  if (score <= 25) return {
    label: 'Critical',
    message: "Your business is losing money in at least three places we can already name. The good news: they're all fixable.",
    tier: 'Starter',
    tierPrice: '£597/mo',
    color: '#FF4D6D',
  }
  if (score <= 45) return {
    label: 'Needs Work',
    message: "There are clear gaps — and most of them are costing you more than you think.",
    tier: 'Starter',
    tierPrice: '£597/mo',
    color: '#FF8C42',
  }
  if (score <= 65) return {
    label: 'Developing',
    message: "You've got solid foundations. The systems will unlock the next level.",
    tier: 'Pro',
    tierPrice: '£1,497/mo',
    color: '#FFD166',
  }
  if (score <= 80) return {
    label: 'Strong',
    message: "You're ahead of most. Let's find the ceiling and push through it.",
    tier: 'Pro or Max',
    tierPrice: '£1,497–£4,997/mo',
    color: '#00E5C3',
  }
  return {
    label: 'Advanced',
    message: "You're operating well. Let's find the hidden leak and compound what's working.",
    tier: 'Max',
    tierPrice: '£4,997/mo',
    color: '#146CFF',
  }
}

// ─── Option tile ─────────────────────────────────────────────────────────────
function OptionTile({ label, selected, onClick, multi }: {
  label: string
  selected: boolean
  onClick: () => void
  multi?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '1rem 1.25rem',
        borderRadius: '10px',
        border: selected
          ? '1.5px solid #00E5C3'
          : '1.5px solid rgba(241,245,249,0.12)',
        background: selected
          ? 'rgba(0,229,195,0.08)'
          : 'rgba(17,24,39,0.4)',
        color: selected ? '#F1F5F9' : 'rgba(241,245,249,0.75)',
        fontSize: '0.9rem',
        lineHeight: 1.5,
        cursor: 'pointer',
        transition: 'all 0.18s',
        boxShadow: selected ? '0 0 16px rgba(0,229,195,0.12)' : 'none',
        marginBottom: '0.5rem',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{
          flexShrink: 0,
          width: 18,
          height: 18,
          marginTop: 2,
          borderRadius: multi ? '4px' : '50%',
          border: selected ? '2px solid #00E5C3' : '2px solid rgba(241,245,249,0.3)',
          background: selected ? '#00E5C3' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="#0B1D3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </span>
    </button>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00E5C3' }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(241,245,249,0.4)' }}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div style={{ height: '3px', background: 'rgba(241,245,249,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(current / total) * 100}%`,
          background: 'linear-gradient(90deg, #00E5C3, #146CFF)',
          borderRadius: '2px',
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

// ─── Hint text ────────────────────────────────────────────────────────────────
function Hint({ text }: { text: string }) {
  return (
    <p style={{
      marginTop: '1.25rem',
      fontSize: '0.8rem',
      color: 'rgba(241,245,249,0.4)',
      fontStyle: 'italic',
      lineHeight: 1.6,
      borderLeft: '2px solid rgba(0,229,195,0.3)',
      paddingLeft: '0.75rem',
    }}>
      {text}
    </p>
  )
}

// ─── Nav buttons ──────────────────────────────────────────────────────────────
function NavButtons({ onBack, onNext, nextLabel = 'Next', nextDisabled }: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
      {onBack && (
        <button onClick={onBack} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.4rem' }}>
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="btn-primary"
        style={{
          fontSize: '0.85rem',
          padding: '0.65rem 1.6rem',
          opacity: nextDisabled ? 0.4 : 1,
          cursor: nextDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(13,31,60,0.7)',
      border: '1px solid rgba(241,245,249,0.08)',
      borderRadius: '16px',
      padding: '2rem',
      backdropFilter: 'blur(12px)',
      maxWidth: 660,
      width: '100%',
      margin: '0 auto',
    }}>
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CatalystDiagnostic() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [gate, setGate] = useState<GateForm>({ firstName: '', businessName: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)

  const dynamicSteps = [
    'industry',
    'teamSize',
    'q1',
    'q2',
    'q3',
    'q4',
    'q5',
    'q6',
    'q7',
    'q8',
    'q9',
    'q10',
    ...(!isSolo(answers.teamSize) ? ['q13'] : []),
    'q11',
    'q12',
    'q14',
  ]

  const totalSteps = dynamicSteps.length
  const currentKey = dynamicSteps[step]
  const displayStep = step + 1

  const goNext = () => {
    if (step < dynamicSteps.length - 1) setStep(s => s + 1)
    else setPhase('gate')
  }
  const goBack = () => {
    if (step > 0) setStep(s => s - 1)
    else setPhase('intro')
  }

  const setSingle = (key: keyof Answers, idx: number) => setAnswers(a => ({ ...a, [key]: idx }))

  const toggleMulti = (idx: number) => {
    setAnswers(a => {
      const prev = a.q5 ?? []
      return { ...a, q5: prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx] }
    })
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={pageWrap}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Catalyst Diagnostic</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem', color: '#F1F5F9' }}>
            This isn't a form.<br />
            <span style={{ color: '#00E5C3' }}>It's a scan.</span>
          </h1>
          <div style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid rgba(241,245,249,0.1)', borderRadius: '12px', padding: '1.5rem 2rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ color: 'rgba(241,245,249,0.8)', lineHeight: 1.75, margin: 0, fontSize: '0.95rem' }}>
              We're going to ask you things most business owners have never been asked. Some of them will sting a little — that's the point. The more honest you are, the more accurate your score.
              <br /><br />
              <strong style={{ color: '#F1F5F9' }}>Takes about 4 minutes.</strong> Your results arrive within 24 hours.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {['Scored 0–100', '4 dimensions', 'AI visibility scan included'].map(tag => (
              <span key={tag} style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(241,245,249,0.5)', border: '1px solid rgba(241,245,249,0.1)', borderRadius: '4px', padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}
            onClick={() => setPhase('questions')}
          >
            Start my scan →
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(241,245,249,0.3)' }}>
            No signup required until the end.
          </p>
        </div>
      </div>
    )
  }

  // ── Form gate ──────────────────────────────────────────────────────────────
  if (phase === 'gate') {
    const score = calcScore(answers)
    const band = getScoreBand(score)

    if (submitted) {
      return (
        <div style={pageWrap}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h2 style={{ color: '#00E5C3', marginBottom: '0.75rem', fontSize: '1.5rem' }}>You're in the queue.</h2>
              <p style={{ color: 'rgba(241,245,249,0.7)', lineHeight: 1.7 }}>
                Your ScaleSage Score and full Frontier Visibility scan will land in your inbox within 24 hours. We're running your business across ChatGPT, Claude, Perplexity, and Gemini now.
              </p>
              <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(0,229,195,0.06)', border: '1px solid rgba(0,229,195,0.2)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(241,245,249,0.5)', margin: 0 }}>Your provisional score</p>
                <p style={{ fontSize: '3rem', fontWeight: 700, color: band.color, margin: '0.25rem 0', letterSpacing: '-0.03em' }}>{score}</p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(241,245,249,0.6)', margin: 0 }}>{band.label}</p>
              </div>
              <a href="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'rgba(241,245,249,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>
                ← Back to ScaleSage
              </a>
            </div>
          </Card>
        </div>
      )
    }

    return (
      <div style={pageWrap}>
        <Card>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>Your score is ready</p>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F1F5F9' }}>
            Before we show you the number —
          </h2>
          <p style={{ color: 'rgba(241,245,249,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We need to know where to send your full results. We're also going to run a live Frontier Visibility scan on your business across ChatGPT, Claude, Perplexity, and Gemini. That takes up to 24 hours. We'll email you everything.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              placeholder="First name"
              value={gate.firstName}
              onChange={e => setGate(g => ({ ...g, firstName: e.target.value }))}
              style={inputStyle}
            />
            <input
              placeholder="Business name"
              value={gate.businessName}
              onChange={e => setGate(g => ({ ...g, businessName: e.target.value }))}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email address"
              value={gate.email}
              onChange={e => setGate(g => ({ ...g, email: e.target.value }))}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="Phone (optional — useful if you want a callback)"
              value={gate.phone}
              onChange={e => setGate(g => ({ ...g, phone: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(241,245,249,0.3)', marginTop: '1rem', lineHeight: 1.6 }}>
            By submitting, you agree we may use publicly available information about your business to enhance your diagnosis. No spam. No hard sell. Unsubscribe any time.
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: '1.25rem', width: '100%', padding: '0.85rem', fontSize: '0.9rem', opacity: (!gate.firstName || !gate.email) ? 0.4 : 1, cursor: (!gate.firstName || !gate.email) ? 'not-allowed' : 'pointer' }}
            disabled={!gate.firstName || !gate.email}
            onClick={() => setSubmitted(true)}
          >
            Show my score →
          </button>
          <button onClick={() => setPhase('questions')} style={{ display: 'block', marginTop: '0.75rem', background: 'none', border: 'none', color: 'rgba(241,245,249,0.35)', fontSize: '0.8rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}>
            ← Go back
          </button>
        </Card>
      </div>
    )
  }

  // ── Questions ──────────────────────────────────────────────────────────────
  return (
    <div style={pageWrap}>
      <div style={{ maxWidth: 660, margin: '0 auto', width: '100%' }}>
        <ProgressBar current={displayStep} total={totalSteps} />

        {currentKey === 'industry' && (
          <Card>
            <h2 style={qStyle}>What kind of business do you run?</h2>
            {INDUSTRY_OPTIONS.map(opt => (
              <OptionTile
                key={opt}
                label={opt}
                selected={(answers as any).industry === opt}
                onClick={() => setAnswers(a => ({ ...a, industry: opt }))}
              />
            ))}
            <NavButtons onNext={goNext} nextDisabled={!(answers as any).industry} />
          </Card>
        )}

        {currentKey === 'teamSize' && (
          <Card>
            <h2 style={qStyle}>How many people work in it, including you?</h2>
            {TEAM_OPTIONS.map(opt => {
              const sel = answers.teamSize === opt
              return (
                <button key={opt} onClick={() => setAnswers(a => ({ ...a, teamSize: opt }))}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.85rem 1.1rem', borderRadius: '8px', marginBottom: '0.4rem',
                    border: sel ? '1.5px solid #00E5C3' : '1.5px solid rgba(241,245,249,0.1)',
                    background: sel ? 'rgba(0,229,195,0.08)' : 'rgba(17,24,39,0.3)',
                    color: sel ? '#F1F5F9' : 'rgba(241,245,249,0.7)', fontSize: '0.88rem', cursor: 'pointer',
                  }}
                >
                  {opt}
                </button>
              )
            })}
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={!answers.teamSize} />
          </Card>
        )}

        {currentKey === 'q1' && (
          <Card>
            <p style={sectionLabel}>Opening question</p>
            <h2 style={qStyle}>Think about last week. What's the one task that ate the most time — the thing you kept doing yourself because it felt easier than explaining it to someone else?</h2>
            <textarea
              placeholder="e.g. chasing invoices, answering the same questions, following up on quotes..."
              value={answers.q1 ?? ''}
              onChange={e => setAnswers(a => ({ ...a, q1: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'rgba(241,245,249,0.35)', marginTop: '0.5rem' }}>This question is unscored — we use it to personalise your results.</p>
            <NavButtons onBack={goBack} onNext={goNext} />
          </Card>
        )}

        {currentKey === 'q2' && (
          <Card>
            <p style={sectionLabel}>Section 1 — Response & Follow-up</p>
            <h2 style={qStyle}>Someone calls your business at 6:30pm on a Tuesday. Nobody picks up. What happens next — honestly?</h2>
            {[
              'They get a voicemail, and someone calls them back first thing in the morning',
              'They get a voicemail — we try to call back when we can',
              'It rings out. If they want us, they\'ll try again',
              'An AI or automated system handles it — they get a response straight away, day or night',
              'I\'m not sure. I don\'t think we have a clear process for this',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q2 === i} onClick={() => setSingle('q2', i)} />
            ))}
            <Hint text="Most businesses lose 30–40% of after-hours enquiries this way. Not because the customer gave up — because nobody was there." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q2 == null} />
          </Card>
        )}

        {currentKey === 'q3' && (
          <Card>
            <p style={sectionLabel}>Section 1 — Response & Follow-up</p>
            <h2 style={qStyle}>Cast your mind back to the last 10 quotes or proposals you sent out. How many of them did you follow up on — without the customer having to chase you first?</h2>
            {[
              'All of them — we have a system that follows up automatically',
              'Most of them — someone on the team handles it, usually within a few days',
              'Some of them — it depends how busy we are at the time',
              'Honestly, not many — if they\'re interested, they come back to us',
              'I couldn\'t tell you — I don\'t track what happens after a quote goes out',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q3 === i} onClick={() => setSingle('q3', i)} />
            ))}
            <Hint text="The average business follows up once. The businesses that win follow up five times. The difference isn't pushiness — it's having a system that does it without anyone remembering." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q3 == null} />
          </Card>
        )}

        {currentKey === 'q4' && (
          <Card>
            <p style={sectionLabel}>Section 1 — Response & Follow-up</p>
            <h2 style={qStyle}>When a job finishes — whether that's a sale, a project, a visit, or a service — what happens next, automatically, without you having to remember?</h2>
            {[
              'Several things happen automatically: a review request, a follow-up message, sometimes an upsell',
              'We ask for a review — but someone has to remember to do it',
              'We send an invoice and that\'s usually the last contact unless they come back',
              'Nothing, really — the job ends and we move on',
              'We don\'t really have a defined process for what happens after',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q4 === i} onClick={() => setSingle('q4', i)} />
            ))}
            <Hint text="The moment after a job is the highest-trust moment you'll ever have with a customer. Most businesses let it go completely." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q4 == null} />
          </Card>
        )}

        {currentKey === 'q5' && (
          <Card>
            <p style={sectionLabel}>Section 2 — Visibility & Reputation</p>
            <h2 style={qStyle}>Open a new tab right now and Google your business name. What actually comes up?</h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(241,245,249,0.5)', marginBottom: '1rem' }}>Select everything that's true.</p>
            {[
              'Our website — and it looks like it represents us properly',
              'A Google Business Profile — the panel on the right or in Maps',
              'Mostly positive reviews, and a decent number of them',
              'Our social media profiles',
              'Competitor ads or competitor results appearing above us',
              'A few directory listings but not much else',
              'Very little — we\'re pretty hard to find by name',
              'I\'ve never actually done this',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} multi selected={(answers.q5 ?? []).includes(i)} onClick={() => toggleMulti(i)} />
            ))}
            <Hint text="If you've never Googled your own business, you've never seen yourself the way every potential customer does." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={(answers.q5 ?? []).length === 0} />
          </Card>
        )}

        {currentKey === 'q6' && (
          <Card>
            <p style={sectionLabel}>Section 2 — Visibility & Reputation</p>
            <h2 style={qStyle}>Now try this. Search for what you do — not your name, but what you offer — in your area. Something like "best plumber in [your town]" or "accountant near [your city]." Where do you appear?</h2>
            {[
              'At the top — we\'ve put real work into this and it shows',
              'Somewhere on the first page, but not in the top three spots',
              'We come up, but only if someone searches quite specifically',
              'We don\'t appear for these kinds of searches',
              'I actually don\'t know — I\'ve never checked',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q6 === i} onClick={() => setSingle('q6', i)} />
            ))}
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q6 == null} />
          </Card>
        )}

        {currentKey === 'q7' && (
          <Card>
            <p style={sectionLabel}>Section 2 — Visibility & Reputation</p>
            <h2 style={qStyle}>Here's something most business owners haven't thought about yet. When someone asks ChatGPT, Google's AI, or Perplexity "who's the best [your type of business] in [your area]" — do you think your business gets mentioned?</h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(241,245,249,0.45)', marginBottom: '1rem' }}>Don't worry — most haven't checked this. We'll run the scan for you as part of your results.</p>
            {[
              'Almost certainly — we have strong reviews, good content, and real online authority',
              'Maybe — I\'d like to think so but I\'m not sure',
              'Probably not — our online presence isn\'t strong enough for that',
              'Definitely not',
              'I had no idea AI could recommend specific businesses — this is new to me',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q7 === i} onClick={() => setSingle('q7', i)} />
            ))}
            <Hint text="This is where the next five years of customer search is heading. Right now, most businesses aren't visible on AI at all — including your competitors. That's a window that won't stay open." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q7 == null} />
          </Card>
        )}

        {currentKey === 'q8' && (
          <Card>
            <p style={sectionLabel}>Section 3 — Systems & Operations</p>
            <h2 style={qStyle}>If a customer enquired three months ago and you never quoted them — or you did quote them but never followed up — would you know their name today?</h2>
            {[
              'Yes — it\'s all in our CRM with full history',
              'Probably — we keep notes, even if it\'s not a proper system',
              'Maybe — it depends whether someone wrote it down at the time',
              'Honestly, no — if they didn\'t book, they\'re gone from our memory',
              'We don\'t really track enquiries at all',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q8 === i} onClick={() => setSingle('q8', i)} />
            ))}
            <Hint text="Every enquiry you can't recall is a customer your competitor eventually won." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q8 == null} />
          </Card>
        )}

        {currentKey === 'q9' && (
          <Card>
            <p style={sectionLabel}>Section 3 — Systems & Operations</p>
            <h2 style={qStyle}>If your best member of staff didn't come in tomorrow — not fired, just ill, suddenly unavailable — how long before the business genuinely struggled?</h2>
            {[
              'A few hours at most — everything is documented and the team knows what to do',
              'A day or two — there\'d be disruption but we\'d manage',
              'A week or so — a lot sits with that person and it would take time to redistribute',
              'Several weeks — real knowledge would walk out the door with them',
              'The business would be in serious trouble almost immediately',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q9 === i} onClick={() => setSingle('q9', i)} />
            ))}
            <Hint text="The businesses that scale are the ones where the knowledge lives in the system, not just the people." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q9 == null} />
          </Card>
        )}

        {currentKey === 'q10' && (
          <Card>
            <p style={sectionLabel}>Section 3 — Systems & Operations</p>
            <h2 style={qStyle}>When a new customer goes through your business — from first contact to finished job to follow-up — how much of that journey happens the same way, every time, without you having to think about it?</h2>
            {[
              'Almost all of it — we have documented processes and most of it runs automatically',
              'Most of the big steps — a few things still depend on whoever\'s handling it',
              'The basics are there but it\'s pretty inconsistent in practice',
              'Every customer gets handled differently — it depends on the day and who\'s involved',
              'There\'s no real process — we figure it out as we go',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q10 === i} onClick={() => setSingle('q10', i)} />
            ))}
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q10 == null} />
          </Card>
        )}

        {currentKey === 'q13' && (
          <Card>
            <p style={sectionLabel}>Section 3 — Systems & Operations</p>
            <h2 style={qStyle}>If your top earner — the person who brings in the most or keeps the most running — decided to leave in 30 days, how much of what they know is written down somewhere?</h2>
            {[
              'Most of it — we have SOPs, documentation, training material they could hand over',
              'Some of it — the main things are documented but plenty lives in their head',
              'Very little — they\'ve just always known how to do it and we\'ve never got around to writing it down',
              'None of it. It would be a serious problem',
              'I\'m not sure what they actually know that nobody else does — that worries me',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q13 === i} onClick={() => setSingle('q13', i)} />
            ))}
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q13 == null} />
          </Card>
        )}

        {currentKey === 'q11' && (
          <Card>
            <p style={sectionLabel}>Section 4 — Customers & Revenue</p>
            <h2 style={qStyle}>Think about your customers from two years ago. How many of them would you bet still remember your business name — and how many have you actually been in touch with since?</h2>
            {[
              'Most of them — we run regular campaigns and stay in contact',
              'Some of them — we reach out occasionally, but it\'s not systematic',
              'The ones who became regulars, yes. The rest, probably not',
              'Very few — we\'re so focused on new customers we rarely go back to old ones',
              'We don\'t really have a way to contact past customers even if we wanted to',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q11 === i} onClick={() => setSingle('q11', i)} />
            ))}
            <Hint text="Getting a past customer back costs a fraction of what winning a new one does. Most businesses have a database full of dormant revenue they've never tapped." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q11 == null} />
          </Card>
        )}

        {currentKey === 'q12' && (
          <Card>
            <p style={sectionLabel}>Section 4 — Customers & Revenue</p>
            <h2 style={qStyle}>If one of your best customers referred a friend to you today — and that friend called, emailed, or walked in — how would that experience actually go?</h2>
            {[
              'Brilliantly. Our process is tight, the team knows what to do, and we make a strong first impression every time',
              'Well, mostly — it\'d be a good experience, but not reliably exceptional',
              'It depends. Some days yes, some days it falls short — whoever picks up the phone makes a big difference',
              'Not well enough, honestly — this is something I know we need to fix',
              'I genuinely don\'t know — I\'ve never thought about what that experience actually looks like from the outside',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q12 === i} onClick={() => setSingle('q12', i)} />
            ))}
            <Hint text="A referral is the highest-trust lead you'll ever receive. Losing them to a poor first impression is the most expensive kind of leak — because it kills the referral relationship too." />
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={answers.q12 == null} />
          </Card>
        )}

        {currentKey === 'q14' && (
          <Card>
            <p style={sectionLabel}>Final question</p>
            <h2 style={qStyle}>Last one. What happens to your business if AI changes the way customers search, compare, and choose — and you're not in the picture?</h2>
            {[
              'We\'re already adapting — this is something we\'re actively working on',
              'I know it\'s coming but I haven\'t done anything about it yet',
              'I\'m not sure how to think about it honestly',
              'It worries me more than I let on',
              'I don\'t think it\'ll affect us — our customers don\'t work that way',
            ].map((opt, i) => (
              <OptionTile key={i} label={opt} selected={answers.q14 === i} onClick={() => setSingle('q14', i)} />
            ))}
            <Hint text="Your customers already use AI to find, compare, and vet businesses. Whether your business shows up in those results is already being decided — with or without you." />
            <NavButtons
              onBack={goBack}
              onNext={() => setPhase('gate')}
              nextLabel="See my results →"
              nextDisabled={answers.q14 == null}
            />
          </Card>
        )}
      </div>
    </div>
  )
}

const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '6rem 1.25rem 4rem',
  position: 'relative',
  zIndex: 1,
}

const qStyle: React.CSSProperties = {
  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
  fontWeight: 700,
  color: '#F1F5F9',
  lineHeight: 1.45,
  letterSpacing: '-0.015em',
  marginBottom: '1.25rem',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#00E5C3',
  marginBottom: '0.6rem',
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(11,29,58,0.6)',
  border: '1.5px solid rgba(241,245,249,0.12)',
  borderRadius: '8px',
  padding: '0.8rem 1rem',
  color: '#F1F5F9',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
}
