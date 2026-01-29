import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Our commitments',
    bullets: [
      'Design and develop according to WCAG 2.2 AA guidelines (mock target).',
      'Conduct quarterly accessibility audits with internal experts and community testers.',
      'Provide keyboard navigation, screen reader-compatible components, and adjustable type scale.',
      'Offer alternative text prompts and captions for audio/video embeds.',
    ],
  },
  {
    title: 'Current accessibility features',
    cards: [
      {
        title: 'Reader mode',
        description: 'Choose between light, dark, and high-contrast themes. Font size can be adjusted globally from settings.',
      },
      {
        title: 'Accessible editor',
        description: 'Writing interface supports keyboard shortcuts, semantic headings, and accessible embeds.',
      },
      {
        title: 'Transcripts',
        description: 'Audio stories automatically generate transcripts (mock feature) with manual editing support.',
      },
    ],
  },
  {
    title: 'Planned improvements (mock roadmap)',
    bullets: [
      'Video captions in additional languages and audio descriptions for visual stories.',
      'Accessibility training for creators, including inclusive language guides.',
      'Bug bounty program focused on assistive technology compatibility.',
    ],
    note: 'We welcome feedback. Accessibility is a shared responsibility between our team and the community.',
  },
];

const cta = {
  title: 'Need assistance accessing NextGen Blog?',
  description: 'Email the accessibility desk or open an issue so we can respond within 48 hours.',
  primary: { label: 'Email accessibility desk', href: 'mailto:accessibility@nextgenblog.com' },
  secondary: { label: 'Submit feedback form', href: 'https://forms.nextgenblog.com/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <InfoPage
      badge="Accessibility"
      title="Accessibility statement (mock)"
      description="We are committed to building an inclusive platform that everyone can use. This mock statement outlines our approach and upcoming improvements."
      sections={sections}
      cta={cta}
      lastUpdated="May 10, 2025"
    />
  );
}
