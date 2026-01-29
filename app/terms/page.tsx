import { InfoPage } from '@/components/info-page';

export default function TermsOfServicePage() {
  return (
    <InfoPage
      badge="Legal"
      title="Terms of Service (mock content)"
      description="These terms outline the agreement between you and NextGen Blog. Review them carefully; they will be replaced with the final legal copy before launch."
      sections={[
        {
          title: '1. Using NextGen Blog',
          bullets: [
            'You must be at least 13 years old to create an account (or older where local laws require).',
            'You are responsible for the content you publish and must ensure it complies with applicable laws.',
            'We grant you a personal, non-transferable license to use the platform while adhering to these terms.',
            'We can update the service at any time and will provide notice for significant changes.',
          ],
        },
        {
          title: '2. Your content & rights',
          bullets: [
            'You retain ownership of your content. By publishing, you grant NextGen Blog a license to host, display, and distribute it within the platform.',
            'You are responsible for clearing rights to any media or third-party content you include.',
            'We may remove or restrict content that violates our policies or legal obligations.',
            'We provide export tools so you can download your content at any time.',
          ],
        },
        {
          title: '3. Payments & monetization',
          bullets: [
            'Revenue share percentages are subject to the partner program agreement (mock 90/10 split).',
            'Payment providers may charge separate fees; we are not responsible for third-party delays.',
            'Refunds for subscriptions are issued according to local regulations and our refund policy.',
            'Taxes, VAT, and compliance with financial reporting are your responsibility.',
          ],
        },
        {
          title: '4. Termination',
          description:
            'You can close your account any time. We can suspend or terminate access if you breach these terms or misuse the platform. Repeated violations may trigger permanent removal.',
        },
        {
          title: '5. Limitation of liability',
          description:
            'The platform is provided “as is”. To the fullest extent permitted by law, we disclaim warranties and limit liability for indirect damages. Full legal wording will be added later.',
          note: 'For legal questions, contact legal@nextgenblog.com. These placeholders will be replaced by counsel-reviewed language in production.',
        },
      ]}
      cta={{
        title: 'Need clarification on our terms?',
        description: 'Reach out to the legal team or explore related policies for additional context.',
        primary: { label: 'Email legal team', href: 'mailto:legal@nextgenblog.com' },
        secondary: { label: 'View privacy policy', href: '/privacy' },
      }}
      lastUpdated="April 15, 2025"
    />
  );
}
