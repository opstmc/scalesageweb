import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

const KEY = 'scalesage_cookie_consent'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(KEY)) setShow(true)
  }, [])

  if (!show) return null

  const consent = (val: 'accepted' | 'essential') => {
    localStorage.setItem(KEY, val)
    setShow(false)
  }

  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(11, 29, 58, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 229, 195, 0.15)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', zIndex: 1000, fontFamily: 'Inter, sans-serif',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ fontSize: 13, color: 'rgba(241,245,249,0.6)', margin: 0, flex: '1 1 320px' }}>
        We use essential cookies to make this site work. With your consent, we also use analytics cookies to understand how visitors use our site. See our{' '}
        <Link to="/cookies" style={{ color: '#00E5C3', textDecoration: 'none' }}>Cookie Policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => consent('essential')}
          style={{
            background: 'transparent', border: '1px solid rgba(241,245,249,0.2)',
            color: '#F1F5F9', borderRadius: 6, padding: '0.5rem 1.2rem',
            fontSize: 12, cursor: 'pointer',
          }}
        >Essential only</button>
        <button
          onClick={() => consent('accepted')}
          style={{
            background: '#00E5C3', color: '#0B1D3A', border: 'none',
            borderRadius: 6, padding: '0.5rem 1.2rem',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >Accept all</button>
      </div>
    </div>
  )
}
