'use client';

import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Talk to the right team',
    cards: [
      {
        tag: 'Support',
        title: 'Creator success specialists',
        description: 'Report an issue, request a feature, or ask for guidance on publishing best practices. Available 24/7 for urgent incidents.',
        href: 'mailto:support@nextgenblog.com',
        linkLabel: 'support@nextgenblog.com',
      },
      {
        tag: 'Partnerships',
        title: 'Business development',
        description: 'Collaborate on branded collections, sponsorships, and events that put your brand alongside high-quality storytelling.',
        href: 'mailto:partners@nextgenblog.com',
        linkLabel: 'partners@nextgenblog.com',
      },
      {
        tag: 'Press',
        title: 'Media enquiries',
        description: 'Get quotes, data, or product updates for coverage. We can arrange interviews with founders or subject matter experts.',
        href: 'mailto:press@nextgenblog.com',
        linkLabel: 'press@nextgenblog.com',
      },
      {
        tag: 'Careers',
        title: 'Join the team',
        description: 'Curious about open roles or the hiring process? Connect with our people team and we’ll follow up with opportunities.',
        href: '/careers',
        linkLabel: 'Explore roles',
      },
    ],
  },
  {
    title: 'What to expect',
    bullets: [
      'Average first response time: under 6 business hours.',
      'Priority routing for urgent platform outages or security reports.',
      'Dedicated onboarding for new publications rolling out to teams.',
      'Slack and Notion integrations available for partner newsrooms.',
    ],
    note: 'If you’re reporting a security issue, please include reproduction steps and reference “Security Disclosure” in your subject line so we can route it immediately.',
  },
  {
    title: 'Office hours & community',
    description:
      'Every Thursday we host live office hours for writers and community leads. Drop in with questions about monetization, analytics, or editorial programming.',
    bullets: [
      'Live Q&A: Thursdays at 10am PT / 1pm ET (Zoom).',
      'Monthly community roundups delivered via the Creator Newsletter.',
      'Quarterly roadmap sessions where we preview upcoming features.',
    ],
  },
];

const cta = {
  title: 'Need a quicker answer?',
  description: 'Chat with a human during business hours or browse the Help Center for instant walkthroughs and FAQs.',
  primary: { label: 'Open live chat', href: 'https://cal.com/nextgen-blog/support' },
  secondary: { label: 'Browse self-serve guides', href: '/help' },
};

export default function ContactPage() {
  return (
    <InfoPage
      badge="Contact"
      title="We’re here to help"
      description="Reach out to the team that keeps NextGen Blog running. Whether you need support, want to partner, or have a press question, we respond within one business day."
      sections={sections}
      cta={cta}
    />
  );
}

