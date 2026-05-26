import { createFileRoute } from "@tanstack/react-router";
import ScaleSage from "@/components/ScaleSage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is ScaleSage for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ScaleSage works with UK and Irish trades businesses, SMEs, and growing operators who are losing revenue through gaps they can't see — missed calls, unanswered quotes, invisible online presence. If you run a business between 1 and 50 people and suspect your systems aren't working as hard as you are, you're the right fit."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a build take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Catalyst Diagnostic takes 30 minutes of your time and delivers a full revenue gap report within 24 hours. A Starter system goes live in 5–7 business days. A Professional system takes 7–10 days. Most clients see their first automated lead captured or call recovered within the first week."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to change the tools I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. ScaleSage builds around what you already have where possible. The only platform required is GoHighLevel, which runs invisibly in the background as the CRM backbone and is included in your setup."
      }
    },
    {
      "@type": "Question",
      "name": "What if it doesn't work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every plan comes with a 90-day guarantee. If ScaleSage doesn't identify at least £1,000 in recoverable monthly revenue in the Catalyst Diagnostic, you pay nothing. If the systems don't hit the agreed success metric within 90 days, ScaleSage keeps building at no extra charge until they do."
      }
    },
    {
      "@type": "Question",
      "name": "Will my customers know they're talking to AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only if you want them to. The AI receptionist answers in your business's name, with your tone of voice and pricing. Most customers experience faster, more consistent responses. You decide how it's presented."
      }
    },
    {
      "@type": "Question",
      "name": "Is ScaleSage just GoHighLevel with a markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. GoHighLevel is one platform ScaleSage uses as a CRM backbone. ScaleSage provides the strategy, configuration, automation sequences, AI training, integrations, and ongoing monitoring. A GoHighLevel account without the build is like a van without a driver."
      }
    },
    {
      "@type": "Question",
      "name": "How is ScaleSage different from a marketing agency?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A marketing agency drives traffic. ScaleSage captures it, qualifies it, follows it up, and books it. Most businesses don't have a lead problem — they have a leaking-bucket problem. ScaleSage seals the bucket first."
      }
    },
    {
      "@type": "Question",
      "name": "Why the 90-day focus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "90 days is how long it takes to see real, measurable results from operational systems — not vanity metrics, but actual booked revenue. At day 30 you see the first signals. At day 60 the pattern is clear. At day 90 there's a verified before/after comparison tied to the guarantee."
      }
    }
  ]
};

export const Route = createFileRoute("/")({
  component: ScaleSage,
  head: () => ({
    meta: [
      { title: "ScaleSage — Revenue Intelligence for Operators" },
      { name: "description", content: "Find the leaks, plug them, prove the lift in 90 days. A diagnostic + build system for operators who measure things." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      },
    ],
  }),
});
