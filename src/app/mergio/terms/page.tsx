export const metadata = {
  title: "Mergio — Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-gray-300 px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 8, 2026</p>

      <p className="mb-6">
        By downloading, installing, or using Mergio (the &quot;App&quot;), you agree to be bound by these Terms of Use. If you do not agree, do not use the App.
      </p>

      <Section title="1. License">
        <p>OlaaSoft MMC grants you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes on devices you own or control.</p>
      </Section>

      <Section title="2. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Reverse engineer, decompile, or disassemble the App</li>
          <li>Modify, adapt, or create derivative works based on the App</li>
          <li>Use the App for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the App</li>
          <li>Use cheats, exploits, or automation software</li>
        </ul>
      </Section>

      <Section title="3. Intellectual Property">
        <p>All content, graphics, designs, and code in the App are the property of OlaaSoft MMC and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.</p>
      </Section>

      <Section title="4. Advertisements">
        <p>The App displays third-party advertisements via Google AdMob. We are not responsible for the content of third-party ads. Ad interactions are governed by the respective advertiser&apos;s terms.</p>
      </Section>

      <Section title="5. Disclaimer of Warranties">
        <p>The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the App will be uninterrupted, error-free, or free of harmful components.</p>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>To the fullest extent permitted by law, OlaaSoft MMC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App.</p>
      </Section>

      <Section title="7. Termination">
        <p>We may terminate or suspend your access to the App at any time, without prior notice, for any reason, including violation of these Terms.</p>
      </Section>

      <Section title="8. Changes to Terms">
        <p>We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the new Terms.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These Terms shall be governed by the laws of the Republic of Azerbaijan, without regard to conflict of law provisions.</p>
      </Section>

      <Section title="10. Contact Us">
        <p>If you have any questions about these Terms, contact us at:</p>
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
