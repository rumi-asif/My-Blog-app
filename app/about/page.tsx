import { InfoPage } from '@/components/info-page';

const stats = [
  { label: 'Writers onboarded', value: '12,500+', description: 'Active storytellers sharing perspectives worldwide.' },
  { label: 'Stories published', value: '85K', description: 'Editorial-quality posts across tech, culture, and creativity.' },
  { label: 'Monthly readers', value: '1.2M', description: 'Engaged readers discovering new voices every week.' },
  { label: 'Average read time', value: '6.5 min', description: 'Short, punchy formats designed for modern attention spans.' },
];

const sections = [
  {
    title: 'Our mission',
    description:
      'Empower creators with the tools, context, and audience they need to publish outstanding work while helping readers uncover the stories worth their time.',
    bullets: [
      'Help writers focus on storytelling by handling design, distribution, and monetization.',
      'Surface meaningful ideas through intelligent recommendations and curated collections.',
      'Grow a respectful community that values thoughtful conversations over hot takes.',
    ],
  },
  {
    title: 'How we got here',
    description:
      'NextGen Blog launched in 2021 when a small team of journalists, designers, and engineers set out to reimagine digital publishing. Since then we have iterated quickly with our community, shipping new writing formats, analytics, and ways to collaborate.',
    bullets: [
      '2021: Private beta for long-form creators.',
      '2022: Launch of collaborative drafting and smart formatting tools.',
      '2023: Introduced partner program, tipping, and premium collections.',
      '2024: Expanded to multilingual support and personalized discovery feeds.',
    ],
  },
  {
    title: 'What we value',
    cards: [
      {
        tag: 'People first',
        title: 'Creator-centric design',
        description: 'We listen to our writers and ship features that reduce friction: from automated formatting to real-time collaboration and insights driven by reader behavior.',
      },
      {
        tag: 'Trust & integrity',
        title: 'Responsible storytelling',
        description: 'We invest in guidelines, tooling, and review flows that reduce misinformation, highlight sources, and celebrate original thought.',
      },
      {
        tag: 'Curiosity',
        title: 'Learning never stops',
        description: 'Quarterly experiments, internal hack weeks, and partnerships with universities keep our platform fresh and grounded in research.',
      },
      {
        tag: 'Impact',
        title: 'Measuring success with outcomes',
        description: 'We track not just clicks but how stories create conversation, connections, and opportunities for the people behind them.',
      },
    ],
  },
  {
    title: 'The team',
    description:
      'We are a globally distributed crew of product thinkers, editors, engineers, and community leads. Ready to work with us? Explore open roles or introduce yourself—new collaborators are always welcome.',
  },
];

const cta = {
  title: 'Join the community shaping the next era of publishing',
  description: 'Whether you are writing your first story or planning a publication, NextGen Blog has the tools to help you launch, grow, and earn.',
  primary: { label: 'Start writing today', href: '/auth/signup' },
  secondary: { label: 'Discover success stories', href: '/partners' },
};

export default function AboutPage() {
  return (
    <InfoPage
      badge="About NextGen Blog"
      title="Building the future of storytelling"
      description="NextGen Blog is a home for curious readers and bold writers. We pair a modern publishing toolkit with a vibrant community so ideas can travel faster and quality work is rewarded."
      stats={stats}
      sections={sections}
      cta={cta}
    />
  );
}

