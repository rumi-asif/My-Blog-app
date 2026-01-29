import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Information we collect',
    bullets: [
      'Account data: name, email, profile details, payment information for paid features.',
      'Usage data: reading history, device information, IP address, and engagement metrics to personalize recommendations.',
      'Content data: stories, drafts, comments, and uploaded media you choose to share.',
      'Third-party data: optional integrations like Google, GitHub, or newsletter tools (mock integration list).',
    ],
  },
  {
    title: 'How we use your data',
    bullets: [
      'Deliver and improve the platform, including content discovery and editing tools.',
      'Send product updates, newsletters, and community notifications (you can adjust preferences).',
      'Enforce our guidelines, prevent fraud, and ensure account security.',
      'Generate anonymized insights to improve features (never sold to advertisers).',
    ],
  },
  {
    title: 'Your controls & rights',
    bullets: [
      'Download or delete your data at any time from account settings.',
      'Update email preferences, push notifications, and recommendation settings.',
      'Request correction of inaccurate personal information.',
      'Residents in certain regions (EU, UK, CA, etc.) have additional rights under local privacy laws.',
    ],
  },
  {
    title: 'Data retention & security',
    description:
      'We retain personal data for as long as your account is active or as required by law. Encryption, audits, and role-based access protect your information. Incident response procedures are tested quarterly.',
    note: 'Mock content: real policy will include our DPO contact, subprocessors, and validated compliance certifications.',
  },
];

const cta = {
  title: 'Have a privacy question?',
  description: 'Email our privacy team or view the cookie policy for detailed tracking information.',
  primary: { label: 'Contact privacy team', href: 'mailto:privacy@nextgenblog.com' },
  secondary: { label: 'Read cookie policy', href: '/cookies' },
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      badge="Privacy"
      title="Privacy Policy (mock content)"
      description="Your trust matters. This mock policy explains how we collect, use, and protect information across the NextGen Blog platform."
      sections={sections}
      cta={cta}
      lastUpdated="March 30, 2025"
    />
  );
}
