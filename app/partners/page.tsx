import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Partnership formats',
    cards: [
      {
        tag: 'Sponsored collections',
        title: 'Curated editorial series',
        description: 'Work with our editors to produce multi-episode collections featuring diverse voices. Includes promotion across homepage slots and newsletters.',
      },
      {
        tag: 'Thought leadership',
        title: 'Executive briefings',
        description: 'Publish original research, industry outlooks, or expert interviews alongside visual storytelling made for busy audiences.',
      },
      {
        tag: 'Events & workshops',
        title: 'Hybrid experiences',
        description: 'Host live AMAs, masterclasses, or writing challenges that culminate in a branded collection of stories.',
      },
      {
        tag: 'Distribution',
        title: 'API & syndication',
        description: 'Sync your CMS with our API to cross-publish or license stories to your owned channels (mock workflow).',
      },
    ],
  },
  {
    title: 'Partner toolkit',
    bullets: [
      'Dedicated partner success manager.',
      'Performance dashboards with engagement and brand lift metrics.',
      'Creative studio support for headline testing, visuals, and audio narration.',
      'Safety and compliance reviews aligned with your industry requirements.',
    ],
  },
  {
    title: 'Sample outcomes (mock data)',
    bullets: [
      'Fintech partner generated 45K qualified leads after a four-part financial literacy series.',
      'University partner increased newsletter subscribers by 38% during admissions season.',
      'Health brand saw a 3.2x lift in content engagement versus traditional ads.',
    ],
  },
];

const cta = {
  title: 'Ready to design a partnership?',
  description: 'Tell us about your goals, audience, and timeline. We’ll tailor a program and pricing model that fits.',
  primary: { label: 'Start a partnership brief', href: 'mailto:partners@nextgenblog.com' },
  secondary: { label: 'View media kit', href: 'https://partners.nextgenblog.com/media-kit' },
};

export default function PartnersPage() {
  return (
    <InfoPage
      badge="Partner Program"
      title="Collaborate with NextGen Blog"
      description="Brands, publishers, and institutions use NextGen Blog to launch ongoing storytelling programs. The details below illustrate how partnerships are structured."
      sections={sections}
      cta={cta}
    />
  );
}
