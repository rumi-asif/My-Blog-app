import { InfoPage } from '@/components/info-page';

const sections = [
  {
    title: 'Authentication',
    description:
      'Authenticate via OAuth 2.0 or personal access tokens. Tokens are scoped to the workspaces you manage and expire every 90 days.',
    bullets: [
      'Base URL (mock): https://api.nextgenblog.com/v1',
      'OAuth scopes: content:write, content:read, analytics:read, members:manage.',
      'All requests must include the Authorization header: Bearer <token>.',
      'Webhook signatures are verified with the X-NGB-Signature header (HMAC SHA-256).',
    ],
  },
  {
    title: 'Key endpoints',
    cards: [
      {
        tag: 'POST /stories',
        title: 'Create a story',
        description: 'Publish draft or scheduled stories with title, body, tags, and access level (public, members, private). Includes mock request and response payloads.',
        href: '/api-docs/stories',
        linkLabel: 'View example',
      },
      {
        tag: 'GET /analytics/overview',
        title: 'Fetch performance metrics',
        description: 'Retrieve reads, completion rate, conversion metrics, and top referrers for a given time range.',
        href: '/api-docs/analytics',
        linkLabel: 'View example',
      },
      {
        tag: 'POST /members',
        title: 'Sync subscribers',
        description: 'Add or update reader profiles, manage segments, and trigger onboarding workflows.',
        href: '/api-docs/members',
        linkLabel: 'View example',
      },
      {
        tag: 'POST /webhooks/test',
        title: 'Test webhooks',
        description: 'Fire mock events (story.published, member.subscribed, payout.completed) so you can validate your integration.',
        href: '/api-docs/webhooks',
        linkLabel: 'View example',
      },
    ],
  },
  {
    title: 'Rate limits & SLAs',
    bullets: [
      'Default limit: 120 requests per minute, per token.',
      'Burst capacity: 500 requests per minute for verified partner apps.',
      'Guaranteed uptime SLA: 99.9% (mock).',
      'Real-time status updates and scheduled maintenance posted on status.nextgenblog.com.',
    ],
  },
];

const cta = {
  title: 'Build with us',
  description: 'Request early access to the real API, browse sample apps, or subscribe to the developer changelog.',
  primary: { label: 'Apply for API access', href: 'https://developers.nextgenblog.com/apply' },
  secondary: { label: 'Join the developer Slack', href: 'https://slack.nextgenblog.com' },
};

export default function ApiDocsPage() {
  return (
    <InfoPage
      badge="Developer"
      title="NextGen API (mock documentation)"
      description="Use the NextGen Blog API to publish content, sync analytics, and manage memberships programmatically. These docs contain placeholder data to illustrate the structure."
      sections={sections}
      cta={cta}
    />
  );
}
