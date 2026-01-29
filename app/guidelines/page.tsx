import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Respect the conversation',
    bullets: [
      'Critique ideas, never identities. Harassment, hate speech, or discrimination is removed immediately.',
      'Stay on topic. Use tags and collections appropriately so readers know what to expect.',
      'Add context when sharing sensitive or graphic content and provide content warnings when necessary.',
      'Do not share private information (yours or others’) without explicit consent.',
    ],
  },
  {
    title: 'Content quality expectations',
    bullets: [
      'Fact-check claims and cite reliable sources. Opinion pieces should be clearly marked.',
      'Disclose sponsorships, gifts, or paid collaborations at the top of the story.',
      'Avoid spam: no keyword stuffing, giveaway schemes, or repetitive self-promotion in comments.',
      'Respect copyright laws and only upload assets you have rights to use.',
    ],
  },
  {
    title: 'Moderation process',
    cards: [
      {
        tag: 'Flag content',
        title: 'Community reporting',
        description: 'Use the report button to alert moderators. Include a short note explaining the issue so we can respond quickly.',
      },
      {
        tag: 'Review timeline',
        title: 'Response within 12 hours',
        description: 'Moderators review high-priority flags within 12 hours. Less urgent items are handled within 48 hours (mock targets).',
      },
      {
        tag: 'Consequences',
        title: 'Tiered enforcement',
        description: 'We use warnings, temporary suspensions, and permanent bans depending on severity and frequency.',
      },
      {
        tag: 'Appeals',
        title: 'Transparent dialogue',
        description: 'Writers can appeal moderation decisions. Provide additional context, sources, or revisions for reconsideration.',
      },
    ],
  },
  {
    title: 'Community tips',
    description:
      'Want to get the most out of the platform? Share drafts with collaborators, promote respectful comment threads, and host themed discussions to spark deeper engagement.',
  },
];

const cta = {
  title: 'Set the tone for great conversations',
  description: 'Message the community team if you want to host an event, launch a publication, or become a volunteer moderator.',
  primary: { label: 'Contact community team', href: 'mailto:community@nextgenblog.com' },
  secondary: { label: 'Read editorial policy', href: '/editorial-policy' },
};

export default function CommunityGuidelinesPage() {
  return (
    <InfoPage
      badge="Community"
      title="Community guidelines (mock)"
      description="We want NextGen Blog to be a safe space for thoughtful discourse. These guidelines outline expected behavior for writers and readers."
      sections={sections}
      cta={cta}
      lastUpdated="May 20, 2025"
    />
  );
}
