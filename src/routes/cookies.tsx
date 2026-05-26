import { createFileRoute } from '@tanstack/react-router'
import { LegalLayout } from '@/components/LegalLayout'

export const Route = createFileRoute('/cookies')({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: 'Cookie Policy — ScaleSage' },
      { name: 'description', content: 'How ScaleSage uses cookies on scalesage.ai.' },
    ],
  }),
})

function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <h2>What are cookies?</h2>
      <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and understand how you use the site.</p>

      <h2>What cookies does scalesage.ai use?</h2>
      <table>
        <thead><tr><th>Cookie Type</th><th>Purpose</th><th>Consent Required</th></tr></thead>
        <tbody>
          <tr><td>Essential</td><td>Required for the site to function (e.g., security, session management)</td><td>No</td></tr>
          <tr><td>Analytics</td><td>Understand how visitors use the site (e.g., pages visited, time on site)</td><td>Yes</td></tr>
        </tbody>
      </table>
      <p>We use privacy-respecting analytics tools that do not track individual users across websites or build advertising profiles.</p>

      <h2>What we do NOT use:</h2>
      <ul>
        <li>Advertising or retargeting cookies</li>
        <li>Third-party tracking cookies</li>
        <li>Social media tracking pixels</li>
      </ul>

      <h2>How to control cookies</h2>
      <p>You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect how the site functions. You can also update your consent preferences at any time by clicking "Cookie Settings" in the footer.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this Cookie Policy as our use of cookies changes. Check this page periodically for updates.</p>

      <p style={{ marginTop: '2rem' }}><strong>Contact:</strong> <a href="mailto:midas@scalesage.ai">midas@scalesage.ai</a></p>
    </LegalLayout>
  )
}
