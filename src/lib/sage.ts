// Typed client for the Sage diagnostic backend (FastAPI).
// Browser-direct (consistent with the existing VITE_GHL_WEBHOOK_URL usage).
// Set VITE_SAGE_API_URL to the backend origin, e.g. https://api.scalesage.ai

const API = (import.meta.env.VITE_SAGE_API_URL ?? '').replace(/\/$/, '')

export interface VisitorInfo {
  name: string
  company: string
  sector: string
  location: string
  email?: string
}

export interface StartResp {
  session_id: string
  first_question: string
  context: string
}

export interface MessageResp {
  next_question: string | null
  is_complete: boolean
  retrieved_context: string
}

export interface Diagnostic {
  executive_summary?: string
  revenue_leaks?: string[]
  opportunities?: string[]
  ai_visibility_score?: number
  ai_visibility_reasoning?: string
  recommended_tier?: string
  tier_reasoning?: string
  bolt_ons?: string[]
  next_step?: string
}

export interface CompleteResp {
  diagnostic: Diagnostic
  recommendations: string[]
  tier: string | null
  bolt_ons: string[]
  next_steps: string | null
}

export interface PayResp {
  outcome: string
  checkout_url: string
  stub?: boolean
}

async function call<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail = String(res.status)
    try {
      const j = await res.json()
      detail = j?.detail ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(`Sage request failed: ${detail}`)
  }
  return res.json() as Promise<T>
}

export const sage = {
  start: (info: VisitorInfo) => call<StartResp>('/sage/session/start', info),
  message: (id: string, answer: string) =>
    call<MessageResp>(`/sage/session/${id}/message`, { answer }),
  complete: (id: string) => call<CompleteResp>(`/sage/session/${id}/complete`),
  bookCall: (id: string) => call<{ outcome: string }>(`/sage/session/${id}/book-call`),
  pay: (id: string) => call<PayResp>(`/sage/session/${id}/pay`),
}

export const SECTORS: Array<{ value: string; label: string }> = [
  { value: 'hvac', label: 'HVAC / Heating' },
  { value: 'electricians', label: 'Electricians' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'ecommerce', label: 'E-commerce' },
]
