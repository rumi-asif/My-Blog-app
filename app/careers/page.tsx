import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Why join NextGen Blog',
    cards: [
      {
        tag: 'Remote-first',
        title: 'Build from anywhere',
        description: 'Collaborate across 10 time zones with flexible schedules, asynchronous workflows, and annual in-person maker retreats.',
      },
      {
        tag: 'Creator obsessed',
        title: 'Design with storytellers',
        description: 'Every project starts with real creator feedback sessions, co-design workshops, and rapid experiments shared with the community.',
      },
      {
        tag: 'Ship quickly',
        title: 'Iterate in weeks, not quarters',
        description: 'We run lightweight sprint rituals, pair design and engineering closely, and celebrate small, frequent launches.',
      },
      {
        tag: 'Grow together',
        title: 'Learning budgets & mentorship',
        description: 'Annual stipends for courses and conferences, internal guilds, and formal mentorship matching keep your skills current.',
      },
    ],
  },
  {
    title: 'Open roles (mock data)',
    cards: [
      {
        tag: 'Product',
        title: 'Senior Product Designer — Content Tools',
        description: 'Reimagine collaborative editing, templates, and publishing flows used by thousands of writers each day.',
        href: 'https://jobs.nextgenblog.com/product-designer',
        linkLabel: 'View position',
      },
      {
        tag: 'Engineering',
        title: 'Staff Software Engineer — Discovery',
        description: 'Lead the team building personalized feeds, search relevance, and reader engagement analytics.',
        href: 'https://jobs.nextgenblog.com/staff-engineer',
        linkLabel: 'View position',
      },
      {
        tag: 'Editorial',
        title: 'Managing Editor — Partnerships',
        description: 'Curate collections with partner publications, develop thematic campaigns, and mentor featured voices.',
        href: 'https://jobs.nextgenblog.com/managing-editor',
        linkLabel: 'View position',
      },
      {
        tag: 'Operations',
        title: 'People Operations Lead',
        description: 'Scale our hiring practices, benefits, and culture rituals as the team grows across regions.',
        href: 'https://jobs.nextgenblog.com/people-ops',
        linkLabel: 'View position',
      },
    ],
    note: 'Roles listed here are illustrative. Subscribe to career updates to be notified when real positions go live.',
  },
  {
    title: 'Hiring process',
    bullets: [
      'Intro chat focused on your motivations and craft.',
      'Portfolio or project deep dive with future collaborators.',
      'Collaborative challenge that mirrors real work; respectful of your time.',
      'Meet leadership, alignment on values, offer and onboarding plan.',
    ],
  },
];

const cta = {
  title: 'Don’t see the right role yet?',
  description: 'Send us your portfolio or a note about what you want to build. We review every submission and reply with next steps.',
  primary: { label: 'Share your story', href: 'mailto:careers@nextgenblog.com' },
  secondary: { label: 'Get job alerts', href: 'https://jobs.nextgenblog.com/newsletter' },
};

export default function CareersPage() {
  return (
    <InfoPage
      badge="Careers"
      title="Work where storytelling meets product craftsmanship"
      description="We are assembling a distributed team of builders, editors, strategists, and advocates who believe publishing should be simpler and more rewarding for everyone."
      sections={sections}
      cta={cta}
    />
  );
}
