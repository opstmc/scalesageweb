import { createFileRoute } from '@tanstack/react-router'
import { CatalystDiagnostic } from '@/components/CatalystDiagnostic'

export const Route = createFileRoute('/diagnostic')({
  component: CatalystDiagnostic,
  head: () => ({
    meta: [
      { title: 'Catalyst Diagnostic — ScaleSage' },
      { name: 'description', content: 'Find out exactly where your business is losing money. A 4-minute diagnostic that scores your operations, visibility, and follow-up across four dimensions.' },
    ],
  }),
})
