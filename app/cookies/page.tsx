import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Types of cookies we use',
    bullets: [
      'Essential cookies: keep you signed in and secure fundamental platform features.',
      'Performance cookies: collect anonymous analytics to understand how stories perform.',
      'Functionality cookies: remember preferences like theme, reading mode, and language.',
      'Advertising cookies: only active for partner campaigns you opt into (mock setting).',
    ],
  },
  {
    title: 'Managing your preferences',
    bullets: [
      'Use the cookie banner or settings panel to enable/disable non-essential cookies.',
      'Opt-out links are provided for third-party analytics tools (mock vendors listed).',
      'Clearing cookies may reset saved preferences and sign you out of the platform.',
    ],
    note: 'Mock vendor list: Aurora Analytics, Pulse Performance, Focus Ads. Replace with real providers before launch.',
  },
  {
    title: 'Storage durations (mock)',
    cards: [
      {
        title: 'Session cookies',
        description: 'Expire when you close the browser. Used for authentication and draft autosave.',
      },
      {
        title: 'Preference cookies',
        description: 'Persist for 12 months so we can remember your reading mode and locale.',
      },
      {
        title: 'Analytics cookies',
        description: 'Retained for 14 months to analyze long-term engagement trends.',
      },
    ],
  },
];

const cta = {
  title: 'Need a custom data processing agreement?',
  description: 'Enterprise teams can request bespoke data retention or cookie configurations.',
  primary: { label: 'Talk to sales', href: 'mailto:sales@nextgenblog.com' },
  secondary: { label: 'Manage cookie preferences', href: '/settings/privacy' },
};

export default function CookiePolicyPage() {
  return (
    <InfoPage
      badge="Cookies"
      title="Cookie Policy (mock content)"
      description="This mock cookie policy explains how we use cookies and similar technologies on NextGen Blog."
      sections={sections}
      cta={cta}
      lastUpdated="March 30, 2025"
    />
  );
}
