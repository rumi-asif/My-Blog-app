import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Core principles',
    bullets: [
      'Accuracy before speed: all factual claims should be sourced, cited, or clearly framed as opinion.',
      'Originality is non-negotiable: no plagiarism, uncredited AI-generated content, or republished work without explicit rights.',
      'Respectful discourse: critique ideas, never identities. Hate speech and harassment result in removal.',
      'Transparency: disclose conflicts of interest, sponsorships, or affiliate relationships at the top of a story.',
    ],
  },
  {
    title: 'Review & escalation process',
    cards: [
      {
        tag: 'Pre-publication',
        title: 'Guided review tools',
        description: 'Writers can run automated checks for citations, tone, and inclusivity. Flagged sections include in-line suggestions and best practices.',
      },
      {
        tag: 'Post-publication',
        title: 'Community signals',
        description: 'Readers can report inaccuracies or policy violations. Our trust & safety team triages within 12 hours and responds with status updates.',
      },
      {
        tag: 'Corrections',
        title: 'Visible change log',
        description: 'Creators must add correction notes or update timestamps. Significant edits trigger email updates for subscribers.',
      },
      {
        tag: 'Appeals',
        title: 'Fair resolution',
        description: 'If content is removed or demonetized, writers receive a detailed explanation and can appeal within seven days.',
      },
    ],
  },
  {
    title: 'Sensitive topics & sourcing',
    description:
      'Certain themes—including health, finance, civic processes, and vulnerable communities—require enhanced scrutiny. Submit supporting documentation or expert review notes when covering these areas.',
    bullets: [
      'Cite primary sources, peer-reviewed research, or subject-matter experts.',
      'Avoid clickbait framing; craft headlines that reflect the substance of the piece.',
      'Mark AI-assisted content and provide human oversight details.',
      'Use inclusive language that reflects the diversity of the communities you cover.',
    ],
  },
  {
    title: 'Consequences for violations',
    description:
      'Most issues are resolved through edits, corrections, or coaching. Severe or repeated breaches may lead to account suspension, demonetization, or permanent removal.',
  },
];

const cta = {
  title: 'Questions about our editorial policy?',
  description: 'Reach the trust & safety desk for clarifications before you publish, or propose updates to the guidelines.',
  primary: { label: 'Contact trust & safety', href: 'mailto:policy@nextgenblog.com' },
  secondary: { label: 'Explore writer guidelines', href: '/writer-guidelines' },
};

export default function EditorialPolicyPage() {
  return (
    <InfoPage
      badge="Editorial Policy"
      title="Standards for trustworthy storytelling"
      description="Our editorial principles protect readers and creators alike. We champion original thinking, fact-checked insights, and respectful debate so every story adds value to the community."
      sections={sections}
      cta={cta}
      lastUpdated="June 1, 2025"
    />
  );
}
