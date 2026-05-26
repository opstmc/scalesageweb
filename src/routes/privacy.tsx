import { createFileRoute } from '@tanstack/react-router'
import { LegalLayout } from '@/components/LegalLayout'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — ScaleSage' },
      { name: 'description', content: 'How ScaleSage collects, uses, and protects personal data under UK GDPR.' },
    ],
  }),
})

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <h2>1. Introduction</h2>
      <p>This Privacy Policy explains how ScaleSage ("we", "us") collects, uses, stores, and protects personal data in connection with the services we provide. We are committed to handling personal data responsibly and in compliance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations 2003 (PECR).</p>

      <h2>2. Who We Are</h2>
      <p>ScaleSage, trading as [Legal Entity TBC], United Kingdom. Contact: <a href="mailto:midas@scalesage.ai">midas@scalesage.ai</a> | scalesage.ai</p>

      <h2>3. Data We Collect</h2>
      <ul>
        <li><strong>From clients:</strong> name, business name, email, phone, payment information (via Stripe — we do not store card details), brand assets, intake form responses, communication records.</li>
        <li><strong>From client customers (as data processor):</strong> names, phone numbers, email addresses, lead data, messaging data, booking data, review data.</li>
        <li><strong>From B2B outreach contacts:</strong> business email, name, business name, job title, industry, location — sourced from publicly available information (Apollo.io, LinkedIn, Companies House, business directories).</li>
        <li><strong>From website visitors:</strong> contact form submissions, basic analytics data, cookie data.</li>
      </ul>

      <h2>4. How We Use Data</h2>
      <ul>
        <li>To deliver services described in your Service Agreement</li>
        <li>To communicate about your engagement</li>
        <li>To process payments</li>
        <li>To send service updates, reports, and invoices</li>
        <li>To run B2B marketing outreach (legitimate interest basis)</li>
        <li>To improve our services</li>
      </ul>

      <h2>5. Legal Basis for Processing</h2>
      <table>
        <thead><tr><th>Processing Activity</th><th>Legal Basis</th></tr></thead>
        <tbody>
          <tr><td>Delivering services to clients</td><td>Performance of a contract</td></tr>
          <tr><td>Processing client customer data</td><td>Contract / Processor instructions</td></tr>
          <tr><td>B2B cold email outreach</td><td>Legitimate interest</td></tr>
          <tr><td>Service communications</td><td>Legitimate interest</td></tr>
          <tr><td>Payment processing</td><td>Contract / Legal obligation</td></tr>
          <tr><td>Marketing to opted-in contacts</td><td>Consent</td></tr>
        </tbody>
      </table>

      <h2>6. Data Sharing</h2>
      <p>We do not sell, rent, or trade personal data. We share data only with sub-processors necessary to deliver our services, including: GoHighLevel (CRM), Stripe (payments), Google Workspace (communications), Vercel (hosting), Instantly (email outreach). All sub-processors are contractually bound to appropriate data protection standards.</p>

      <h2>7. Data Retention</h2>
      <table>
        <thead><tr><th>Data Category</th><th>Retention Period</th></tr></thead>
        <tbody>
          <tr><td>Client engagement data</td><td>Duration + 6 years</td></tr>
          <tr><td>Client customer data</td><td>Duration + 12 months</td></tr>
          <tr><td>B2B outreach contacts</td><td>12 months from last contact</td></tr>
          <tr><td>Website form submissions</td><td>12 months</td></tr>
          <tr><td>Payment records</td><td>6 years (HMRC)</td></tr>
          <tr><td>Suppression list (opt-outs)</td><td>Indefinite</td></tr>
        </tbody>
      </table>

      <h2>8. Your Rights</h2>
      <p>Under UK GDPR you have the right to: access, rectification, erasure, restriction, portability, objection, and withdrawal of consent. Contact us at <a href="mailto:midas@scalesage.ai">midas@scalesage.ai</a>. We respond within 30 days. Complaints: Information Commissioner's Office (<a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a> | 0303 123 1113).</p>

      <h2>9. International Transfers</h2>
      <p>Some sub-processors operate outside the UK. Where data is transferred internationally, we rely on UK adequacy decisions, UK International Data Transfer Agreements (IDTA), or Standard Contractual Clauses.</p>

      <h2>10. Cookies</h2>
      <p>See our Cookie Policy at <a href="/cookies">scalesage.ai/cookies</a>.</p>

      <h2>11. Changes</h2>
      <p>We may update this policy. Material changes are notified to active clients with 30 days' notice.</p>

      <p style={{ marginTop: '2rem' }}><strong>Contact:</strong> <a href="mailto:midas@scalesage.ai">midas@scalesage.ai</a></p>
      <p style={{ fontStyle: 'italic', color: 'rgba(241,245,249,0.4)', marginTop: '2rem' }}>This policy requires review by a qualified solicitor before use with clients.</p>
    </LegalLayout>
  )
}
