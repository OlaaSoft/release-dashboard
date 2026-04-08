export const metadata = {
  title: "Mergio — Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-gray-300 px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 8, 2026</p>

      <p className="mb-6">
        OlaaSoft MMC (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Mergio mobile application (the &quot;App&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our App.
      </p>

      <Section title="1. Information We Collect">
        <p>We do not collect personally identifiable information such as your name, email, or phone number. The App may collect the following non-personal data automatically:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li><strong>Device information:</strong> device model, operating system version, unique device identifiers</li>
          <li><strong>Usage data:</strong> app usage statistics, game scores, session duration</li>
          <li><strong>Crash reports:</strong> error logs and diagnostics via Firebase Crashlytics and Sentry</li>
          <li><strong>Advertising ID:</strong> used to serve personalized ads via Google AdMob</li>
          <li><strong>Analytics data:</strong> anonymous usage patterns via Firebase Analytics and Mixpanel</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc ml-6 space-y-1">
          <li>To provide and maintain the App</li>
          <li>To improve gameplay experience and fix bugs</li>
          <li>To display advertisements via Google AdMob</li>
          <li>To analyze usage trends and optimize performance</li>
        </ul>
      </Section>

      <Section title="3. Third-Party Services">
        <p>The App uses the following third-party services that may collect data:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li><strong>Google AdMob</strong> — ad serving and advertising ID collection</li>
          <li><strong>Firebase</strong> — analytics, crashlytics, remote config, cloud messaging</li>
          <li><strong>Mixpanel</strong> — anonymous analytics</li>
          <li><strong>Sentry</strong> — error tracking and crash reporting</li>
        </ul>
        <p className="mt-2">Each service has its own privacy policy governing data collection.</p>
      </Section>

      <Section title="4. Advertising">
        <p>The App displays ads provided by Google AdMob. AdMob may use your Advertising ID to serve personalized ads. You can opt out of personalized ads in your device settings.</p>
      </Section>

      <Section title="5. Children's Privacy">
        <p>The App is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal data, we will delete it immediately.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain non-personal data for as long as necessary to fulfill the purposes outlined in this policy. Crash logs and analytics data are automatically deleted after 90 days.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You may request deletion of any data associated with your device by contacting us. You can also reset your Advertising ID or opt out of personalized ads through your device settings.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
      </Section>

      <Section title="9. Contact Us">
        <p>If you have any questions about this Privacy Policy, contact us at:</p>
        <p className="mt-2 text-white">info@olaasoft.com</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
