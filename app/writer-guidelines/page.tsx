import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Before you publish',
    bullets: [
      'Clarify your angle, audience, and key takeaway. Readers should know why the story matters within the first few paragraphs.',
      'Use descriptive, accurate headlines and subtitles. Avoid clickbait or overly vague titles.',
      'Add at least one visual (image, embed, or chart) to support your narrative. Credit the source or create original artwork.',
      'Run the in-editor review to check tone, inclusivity, and grammar before hitting publish.',
    ],
  },
  {
    title: 'Formatting best practices',
    bullets: [
      'Keep paragraphs short (3–4 sentences) and use subheadings to guide the reader.',
      'Use pull quotes, callouts, and lists to break up dense sections.',
      'Add relevant tags (max 5) so the recommendation engine can surface your work appropriately.',
      'Link to sources and related stories to provide additional context.',
    ],
  },
  {
    title: 'Engaging with readers',
    description:
      'Stories that spark conversation perform better. Reply to top comments, invite feedback, and encourage readers to follow you for updates.',
    bullets: [
      'Pin a comment that summarizes key resources or next steps.',
      'Share your story to social platforms using built-in share cards.',
      'Highlight reader contributions in follow-up posts or newsletters.',
    ],
  },
  {
    title: 'Monetization readiness checklist',
    cards: [
      {
        title: 'Audience basics',
        description: 'Grow to 500 engaged followers and maintain a 45% read completion average to unlock tipping (mock metrics).',
      },
      {
        title: 'Premium content',
        description: 'Create a members-only series that delivers tangible value—bonus interviews, templates, or deeper analysis.',
      },
      {
        title: 'Consistency',
        description: 'Aim for a regular cadence (weekly or bi-weekly) and communicate schedule changes in advance.',
      },
    ],
    note: 'Actual thresholds and requirements will be updated before we launch the monetization suite.',
  },
];

const cta = {
  title: 'Pitch a featured series',
  description: 'Want to collaborate on a themed collection or mentorship? Share your idea and we’ll respond within a week.',
  primary: { label: 'Submit a pitch', href: 'mailto:pitches@nextgenblog.com' },
  secondary: { label: 'Explore partner program', href: '/partners' },
};

export default function WriterGuidelinesPage() {
  return (
    <InfoPage
      badge="Writers"
      title="Writer guidelines (mock)"
      description="These guidelines help you craft stories that resonate with readers and align with our platform standards."
      sections={sections}
      cta={cta}
    />
  );
}
