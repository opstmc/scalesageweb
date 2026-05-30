import { createFileRoute } from '@tanstack/react-router'
import { SageConversation } from '@/components/SageConversation'

export const Route = createFileRoute('/sage')({
  component: SageConversation,
  head: () => ({
    meta: [
      { title: 'Sage — ScaleSage AI Diagnostic' },
      {
        name: 'description',
        content:
          'Talk to Sage, ScaleSage’s AI business diagnostic. Answer a few sharp questions and get a personalised breakdown of your revenue leaks, AI visibility, and next steps.',
      },
    ],
  }),
})
