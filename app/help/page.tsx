import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Popular topics',
    cards: [
      {
        tag: 'Getting started',
        title: 'Publish your first story',
        description: 'Learn how to format, embed media, schedule, and share your post using the intuitive NextGen editor. Includes a downloadable checklist.',
        href: '/help/publish',
        linkLabel: 'View guide',
      },
      {
        tag: 'Audience',
        title: 'Grow with recommendations',
        description: 'Understand how the discovery feed works, what signals matter, and how to use tags and series to reach the right readers.',
        href: '/help/discovery',
        linkLabel: 'View guide',
      },
      {
        tag: 'Monetization',
        title: 'Set up paid subscriptions',
        description: 'Enable member-only content, configure pricing, and connect payouts. Includes mock dashboards and revenue examples.',
        href: '/help/monetization',
        linkLabel: 'View guide',
      },
      {
        tag: 'Analytics',
        title: 'Interpret your dashboard',
        description: 'Break down reader trends, completion rates, and conversion funnels so you can iterate with confidence.',
        href: '/help/analytics',
        linkLabel: 'View guide',
      },
    ],
  },
  {
    title: 'Self-service resources',
    bullets: [
      'Creator Handbook (PDF) — in-depth platform walkthrough.',
      'Weekly onboarding webinar — Fridays at 9am PT (recordings available).',
      'Community Forum — peer support moderated by staff specialists.',
      'Status Page — real-time updates on incidents and maintenance windows.',
    ],
  },
  {
    title: 'Need more help?',
    description:
      'Contact support with screenshots and links so we can replicate the issue quickly. Enterprise customers have access to a dedicated Slack channel and guaranteed SLA.',
    note: 'Mock response times: High priority (2 hours), Standard (6 hours), Feature questions (24 hours).',
  },
];

const cta = {
  title: 'Can’t find what you need?',
  description: 'Open a ticket with our Creator Success team or join office hours to chat live with an expert.',
  primary: { label: 'Submit a support ticket', href: 'mailto:support@nextgenblog.com' },
  secondary: { label: 'Join office hours', href: 'https://cal.com/nextgen-blog/office-hours' },
};

export default function HelpCenterPage() {
  return (
    <InfoPage
      badge="Help Center"
      title="Find answers fast"
      description="Browse quick-start guides, troubleshooting tips, and best practices for getting the most out of NextGen Blog. All content here is mock data for now."
      sections={sections}
      cta={cta}
    />
  );
}
