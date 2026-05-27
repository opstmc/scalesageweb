import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { GlobeCanvas } from './GlobeCanvas'
import { DataNetwork } from './DataNetwork'
import { useGlobeScroll, GlobeState } from '@/hooks/useGlobeScroll'

const chapterBase = "absolute left-0 w-full h-screen flex items-center"

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: "Who is ScaleSage for?",
      a: "ScaleSage works with UK and Irish trades businesses, SMEs, and growing operators who are losing revenue through gaps they can't see — missed calls, unanswered quotes, invisible online presence. If you run a business between 1 and 50 people and suspect your systems aren't working as hard as you are, you're the right fit. We're not for businesses looking for a quick fix or a one-size-fits-all software tool."
    },
    {
      q: "How long does a build take?",
      a: "The Catalyst Diagnostic takes 30 minutes of your time and delivers a full revenue gap report within 24 hours. From there, a Starter system goes live in 5–7 business days. A Professional system takes 7–10 days. You're not waiting months — most clients see their first automated lead captured or call recovered within the first week."
    },
    {
      q: "Do I need to change the tools I use?",
      a: "No. We build around what you already have where possible. If you're using WhatsApp to communicate with customers, we automate that. If you use a spreadsheet to track jobs, we can replace it with a proper pipeline — or connect to it. The only platform we require is GoHighLevel (our CRM backbone, included in your setup), which runs invisibly in the background."
    },
    {
      q: "What if it doesn't work?",
      a: "Every plan comes with a 90-day guarantee. If we don't identify at least £1,000 in recoverable monthly revenue in your Catalyst Diagnostic, you pay nothing. And if the systems we build don't hit the agreed success metric within 90 days, we keep building — at no extra charge — until they do. No exit clause. No fine print."
    },
    {
      q: "Will my customers know they're talking to AI?",
      a: "Only if you want them to. Our AI receptionist answers calls and messages in your business's name, with your tone of voice, your service areas, and your pricing. Most customers simply experience faster, more consistent responses. You decide how it's presented. We never deploy systems that deceive customers in ways that damage trust."
    },
    {
      q: "Is this just GoHighLevel with a markup?",
      a: "No. GoHighLevel is one of several platforms we use — it's the CRM backbone. What ScaleSage builds is the strategy, the configuration, the automation sequences, the AI training, the integrations, and the ongoing monitoring. A GoHighLevel account without the build is like a van without a driver. The platform costs £97/month on its own. We charge for the system that makes it work."
    },
    {
      q: "How is ScaleSage different from a marketing agency?",
      a: "A marketing agency drives traffic. ScaleSage captures it, qualifies it, follows it up, and books it. We're not focused on getting more people to your website — we're focused on making sure the people who already contact you actually become paying jobs. Most businesses don't have a lead problem. They have a leaking-bucket problem. We seal the bucket first."
    },
    {
      q: "Why the 90-day focus?",
      a: "Because that's how long it takes to see real, measurable results from operational systems — not vanity metrics, but actual booked revenue. At day 30 you see the first signals. At day 60 the pattern is clear. At day 90 we have a verified before/after comparison. That timeline also protects you: our guarantee is tied to 90 days, not 12 months, so you're not locked into a long contract before you've seen proof."
    },
  ]

  return (
    <div className="faq-section">
      {faqs.map((faq, i) => {
        const isOpen = i === openIndex
        return (
          <div key={i} className="faq-item">
            <button
              className={`faq-question ${isOpen ? 'open' : ''}`}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              {faq.q}
              <span className="faq-icon">+</span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
              <p>{faq.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CaseStudiesCarousel() {
  const [idx, setIdx] = useState(0)
  const total = 3
  const next = () => setIdx(i => Math.min(i + 1, total - 1))
  const prev = () => setIdx(i => Math.max(i - 1, 0))

  return (
    <div className="cs-carousel-wrap">
      <button
        className="cs-arrow"
        onClick={prev}
        disabled={idx === 0}
        aria-label="Previous case study"
      >←</button>

      <div className="cs-viewport">
        <div className="cs-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {/* Card 1 */}
          <div className="cs-slide">
            <div className="case-study-card cs-card-lg">
              <div>
                <span className="industry-badge">Electrical Contractor</span>
                <span className="cs-location">Manchester, UK</span>
                <div className="cs-tier">Catalyst — Tier 2</div>
              </div>
              <div>
                <div className="cs-metric-big cs-metric-xl">£3,200<span style={{ fontSize: '2rem', color: 'rgba(241,245,249,0.5)' }}>/mo</span></div>
                <div className="cs-metric-label">Revenue recovered in 90 days</div>
              </div>
              <div className="cs-stats">
                <div className="cs-stat"><div className="cs-stat-num">+47%</div><div className="cs-stat-label">More enquiries</div></div>
                <div className="cs-stat"><div className="cs-stat-num">31h</div><div className="cs-stat-label">Saved per week</div></div>
                <div className="cs-stat"><div className="cs-stat-num">£0</div><div className="cs-stat-label">Upfront cost</div></div>
              </div>
              <p className="cs-quote cs-quote-lg">"Results pending — case study in progress."</p>
              <div className="cs-footer">
                <span className="cs-footer-date">📅 Day 60 — Results being documented</span>
                <span className="cs-pill amber">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="cs-slide">
            <div className="case-study-card cs-card-lg">
              <div>
                <span className="industry-badge">Plumbing & Heating</span>
                <span className="cs-location">Cardiff, Wales</span>
                <div className="cs-tier">Catalyst — Tier 1</div>
              </div>
              <div>
                <div className="cs-metric-big cs-metric-xl">28</div>
                <div className="cs-metric-label">New Google reviews in 6 weeks</div>
              </div>
              <div className="cs-stats">
                <div className="cs-stat"><div className="cs-stat-num">4.2→4.8</div><div className="cs-stat-label">Google rating</div></div>
                <div className="cs-stat"><div className="cs-stat-num">48h</div><div className="cs-stat-label">Go-live time</div></div>
                <div className="cs-stat"><div className="cs-stat-num">100%</div><div className="cs-stat-label">Calls answered</div></div>
              </div>
              <p className="cs-quote cs-quote-lg">"Results pending — case study in progress."</p>
              <div className="cs-footer">
                <span className="cs-footer-date">📅 Day 45 — Results being documented</span>
                <span className="cs-pill amber">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Open Slot */}
          <div className="cs-slide">
            <div className="case-study-card cs-card-lg cs-open-slot">
              <div>
                <span className="industry-badge">Your Industry</span>
                <span className="cs-location">UK & Ireland</span>
                <div className="cs-tier">Any Tier</div>
              </div>
              <div className="cs-open-icon">+</div>
              <h3>Could this be you?</h3>
              <p>We're selecting 3 businesses for our founding case study programme. Full build. Real results. Your story on this page.</p>
              <Link to="/diagnostic" className="btn-primary">Apply for a Pilot Spot →</Link>
              <div className="cs-footer" style={{ justifyContent: 'center' }}>
                <span className="cs-pill teal">1 spot remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="cs-arrow"
        onClick={next}
        disabled={idx === total - 1}
        aria-label="Next case study"
      >→</button>

      <div className="cs-dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className={`cs-dot ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to case study ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function Chapter({ id, top, align = 'left', tall, children }: { id: string; top: string; align?: 'left'|'right'|'center'; tall?: boolean; children: React.ReactNode }) {
  const justify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
  const isCenter = align === 'center'
  return (
    <section
      id={id}
      className={`${chapterBase} ${justify}`}
      style={{ top, alignItems: tall ? 'flex-start' : 'center', paddingTop: tall ? '8vh' : 0, paddingBottom: tall ? '4vh' : 0 }}
    >
      <div className={`ch-content px-8 md:px-16 ${isCenter ? 'max-w-4xl mx-auto text-center flex flex-col items-center' : 'max-w-xl'}`}>
        {children}
      </div>
    </section>
  )
}

export default function ScaleSage() {
  const globeState = useRef<GlobeState>({
    posX: 2.2, posY: 0, posZ: 0,
    rotY: 0, rotX: .1, scale: 1,
    camZ: 4.0, camX: 0, camY: 0,
    sBlueOpacity: 0, sSilverOpacity: 0, sEdgeOpacity: 0,
    rimOpacity: 0, atmOpacity: 0.15, globeOpacity: 1.0,
  })

  useGlobeScroll(globeState)

  return (
    <div className="text-fog relative">
      <DataNetwork />
      <GlobeCanvas stateRef={globeState} />

      {/* Nav */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between"
        style={{ padding: '1.25rem 2rem', background: 'linear-gradient(to bottom, rgba(11,29,58,0.85) 0%, transparent 100%)', backdropFilter: 'blur(0px)' }}
      >
        <a href="/" className="logo text-xl font-bold tracking-tight text-fog" style={{ textDecoration: 'none' }}>ScaleSage</a>
        <nav className="hidden md:flex gap-8 text-sm" style={{ color: 'rgba(241,245,249,0.65)' }}>
          <a href="#ch1" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color='#00E5C3')} onMouseLeave={e => (e.currentTarget.style.color='inherit')}>Diagnose</a>
          <a href="#ch2" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color='#00E5C3')} onMouseLeave={e => (e.currentTarget.style.color='inherit')}>Build</a>
          <a href="#ch3" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color='#00E5C3')} onMouseLeave={e => (e.currentTarget.style.color='inherit')}>Prove</a>
          <a href="#ch5" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color='#00E5C3')} onMouseLeave={e => (e.currentTarget.style.color='inherit')}>Pricing</a>
        </nav>
        <Link to="/diagnostic" className="nav-btn" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>Run Diagnostic →</Link>
      </header>

      {/* Scroll container */}
      <div id="pin-wrap" className="relative" style={{ height: '647vh', zIndex: 10 }}>

        <Chapter id="ch0" top="0vh">
          <p className="eyebrow mb-6">
            <span className="accent-teal">DIAGNOSE.</span>{' '}
            <span className="accent-white">BUILD.</span>{' '}
            <span className="accent-blue">PROVE.</span>
          </p>
          <h1 className="ch-word text-6xl md:text-7xl mb-6">
            Your business <br/>
            <span className="accent-teal">is leaking.</span>
          </h1>
          <p className="text-fog/70 text-lg mb-10 max-w-md">
            Missed calls. Cold quotes. Forgotten reviews. We find the gaps, plug them, and prove the lift in 90 days.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/diagnostic" className="btn-primary">Run My Diagnostic →</Link>
            <a href="#ch5" className="btn-secondary">See Pricing</a>
          </div>
        </Chapter>

        <Chapter id="ch1" top="72vh">
          <p className="eyebrow mb-6">Step One — Diagnose</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-6">
            The <span className="accent-teal">Catalyst</span> Diagnostic.
          </h2>
          <p className="text-fog/70 mb-6">
            4 minutes. Scored 0–100 across response speed, visibility, systems, and revenue recovery. Your results — including a live AI search scan — within 24 hours.
          </p>
          <div className="border border-fog/10 bg-navy3/70 backdrop-blur rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow">Sample Report</span>
              <span className="text-teal text-sm font-medium">Score 64/100</span>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Missed call recovery', '38%', '#C49A3C'],
                ['Quote follow-up', '12%', '#C49A3C'],
                ['Review velocity', '71%', '#00E5C3'],
                ['AI search presence', '24%', '#C49A3C'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-fog/70">{k}</span>
                  <span style={{ color: c as string }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/diagnostic" className="btn-primary">Start My Diagnostic →</Link>
        </Chapter>

        <Chapter id="ch2" top="144vh" align="right">
          <p className="eyebrow mb-6">Step Two — Build</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-6">
            Systems that <span className="accent-teal">don't sleep.</span>
          </h2>
          <p className="text-fog/70 mb-8">
            AI receptionists, automated quote chasing, review engines, and pipeline orchestration — installed and monitored.
          </p>
          <div className="border border-teal/30 bg-navy3/70 backdrop-blur rounded-xl p-6">
            <div className="eyebrow mb-2">90-Day Guarantee</div>
            <p className="text-fog text-xl leading-snug font-medium">
              Measurable lift in booked revenue or we keep working — free — until you see it.
            </p>
          </div>
        </Chapter>

        <Chapter id="ch3" top="216vh">
          <p className="eyebrow mb-6">Step Three — Prove</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-8">
            Numbers, <span className="accent-teal">not stories.</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              ['+42%', 'Booked revenue'],
              ['3.1×', 'Review velocity'],
              ['<2m', 'Response time'],
              ['£147k', 'Avg recovered / yr'],
            ].map(([n, l]) => (
              <div key={l} className="border border-fog/10 bg-navy3/60 backdrop-blur rounded-xl p-5">
                <div className="text-4xl font-bold text-teal tracking-tight">{n}</div>
                <div className="text-xs text-fog/60 mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Mockup */}
          <div className="dashboard-panel mb-8">
            <div className="dashboard-header">
              <div className="dashboard-brand">
                <div className="dashboard-logo">S</div>
                <div>
                  <div className="dashboard-title">Catalyst Report — Mike's Electrical, Manchester</div>
                </div>
              </div>
              <span className="dashboard-live">Live</span>
            </div>
            <div className="dashboard-body">
              {[
                { label: 'Missed Call Recovery', pct: 38, color: '#C49A3C', value: '38% captured', target: 'Target: 85%' },
                { label: 'Quote Follow-up Rate', pct: 22, color: '#C49A3C', value: '22%', target: 'Target: 90%' },
                { label: 'Review Velocity', pct: 71, color: '#00E5C3', value: '4.6★ Google', target: '↑ 0.6 this month' },
                { label: 'AI Search Visibility', pct: 24, color: '#C49A3C', value: '24/100', target: 'Target: 70+' },
              ].map((row) => (
                <div key={row.label} className="dashboard-row">
                  <div className="dashboard-row-top">
                    <span className="dashboard-row-label">{row.label}</span>
                    <span className="dashboard-row-value" style={{ color: row.color }}>{row.value}</span>
                  </div>
                  <div className="dashboard-bar-bg">
                    <div className="dashboard-bar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                  <div className="dashboard-row-target">{row.target}</div>
                </div>
              ))}
            </div>
            <div className="dashboard-banner">
              Monthly leak identified: £3,250 → Systems deployed. Recovery in progress.
            </div>
          </div>

          <blockquote className="border-l-2 border-teal pl-4 text-fog/80 text-lg">
            "We thought we had a marketing problem. Turns out we had a leaking-bucket problem. They sealed it."
            <div className="text-xs text-fog/50 mt-2">— Operations Director, regional services group</div>
          </blockquote>
        </Chapter>

        <Chapter id="ch4" top="288vh" align="center" tall>
          <p className="eyebrow mb-6">Results</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-4">
            Real businesses. <span className="accent-teal">Real numbers.</span>
          </h2>
          <p className="text-fog/60 mb-2 max-w-2xl mx-auto">
            Case studies added as clients complete their first 90 days.
          </p>

          <CaseStudiesCarousel />
        </Chapter>

        <Chapter id="ch5" top="360vh" align="center" tall>
          <p className="eyebrow mb-6">TRANSPARENT PRICING · NO SURPRISES</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-4">
            Built for <span className="accent-teal">operators.</span>
          </h2>
          <p className="pricing-tagline mb-10">
            No lock-in. No setup fees. Cancel anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left items-center w-full max-w-4xl">
            {[
              { name: 'Starter', setup: '£297', price: '£97/mo', notes: ['Missed call recovery', 'Lead capture', 'Review automation', 'Basic dashboard'] },
              { name: 'Professional', setup: '£597', price: '£197/mo', notes: ['Everything in Starter', 'Appointment booking', 'Quote follow-up', 'Pipeline management', 'Bi-weekly check-ins'], featured: true },
              { name: 'Growth', setup: '£997', price: '£397/mo', notes: ['Everything in Professional', 'Multi-pipeline', 'Advanced reporting', 'Monthly strategy call', 'Priority support'] },
            ].map(p => (
              <div
                key={p.name}
                className={`rounded-xl p-6 backdrop-blur border flex flex-col ${p.featured ? 'border-teal/50 bg-teal/5' : 'border-fog/10 bg-navy3/60'}`}
                style={p.featured ? { transform: 'scale(1.06)', border: '1px solid rgba(0,229,195,0.5)', zIndex: 10 } : {}}
              >
                <div className="eyebrow">{p.name}</div>
                <div className="text-xs text-fog/50 mt-1">Setup: {p.setup}</div>
                <div
                  className="font-bold mt-2 text-fog tracking-tight"
                  style={{ fontSize: p.featured ? '3.5rem' : '2.25rem', lineHeight: 1 }}
                >
                  {p.price}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-fog/70 flex-1">
                  {p.notes.map(n => <li key={n}>— {n}</li>)}
                </ul>
                <Link
                  to="/diagnostic"
                  className={p.featured ? 'btn-primary' : 'btn-secondary'}
                  style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.65rem 1rem' }}
                >
                  Start Diagnostic →
                </Link>
              </div>
            ))}
          </div>
          <p className="pricing-guarantee mt-10">
            90-day money-back guarantee on all plans. If we don't find £1,000+ in recoverable revenue, you pay nothing.
          </p>
        </Chapter>

        <Chapter id="ch6" top="432vh" align="center" tall>
          <p className="eyebrow mb-6">Questions</p>
          <h2 className="ch-word text-5xl md:text-6xl mb-4">
            Questions worth <span className="accent-teal">answering up front.</span>
          </h2>
          <p className="text-fog/60 mb-10 max-w-2xl mx-auto">
            If you're thinking it, it's here.
          </p>
          <FAQAccordion />
        </Chapter>

        <Chapter id="ch7" top="504vh" align="center">
          <p className="eyebrow mb-6">Begin</p>
          <h2 className="ch-word mb-8" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1.0, textAlign: 'center', fontWeight: 700 }}>
            <span style={{ color: '#F1F5F9', display: 'block' }}>Stop</span>
            <span style={{ color: '#00E5C3', display: 'block' }}>leaking.</span>
            <span style={{ color: '#F1F5F9', display: 'block' }}>Start</span>
            <span style={{ color: '#146CFF', display: 'block' }}>compounding.</span>
          </h2>
          <Link to="/diagnostic" className="btn-primary !text-base !px-8 !py-4">
            Start the Diagnostic →
          </Link>
        </Chapter>

        <Chapter id="ch8" top="576vh" align="center" tall>
          <div className="w-full">
            <div className="grid md:grid-cols-4 gap-12 text-left text-sm">
              <div>
                <div className="logo text-xl font-bold mb-3 text-fog">ScaleSage</div>
                <p className="text-fog/50">Revenue intelligence for operators who measure things.</p>
              </div>
              <div>
                <div className="eyebrow mb-3 !text-fog/40">Sections</div>
                <ul className="space-y-2 text-fog/70">
                  <li><a href="#ch1">Diagnose</a></li>
                  <li><a href="#ch2">Build</a></li>
                  <li><a href="#ch3">Prove</a></li>
                  <li><a href="#ch5">Pricing</a></li>
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-3 !text-fog/40">Legal</div>
                <ul className="space-y-2 text-fog/70">
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="/cookies">Cookie Policy</a></li>
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-3 !text-fog/40">Contact</div>
                <a href="mailto:midas@scalesage.ai" className="text-fog/70 hover:text-teal transition">midas@scalesage.ai</a>
              </div>
            </div>
            <p className="text-center mt-12" style={{ fontSize: 11, color: 'rgba(241,245,249,0.3)' }} suppressHydrationWarning>
              © 2026 ScaleSage. All rights reserved. | <a href="mailto:midas@scalesage.ai" style={{ color: 'inherit' }}>midas@scalesage.ai</a>
            </p>
          </div>
        </Chapter>


      </div>
    </div>
  )
}
