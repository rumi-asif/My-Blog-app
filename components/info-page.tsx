import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface InfoPageCard {
  title: string;
  description: string;
  tag?: string;
  href?: string;
  linkLabel?: string;
}

interface InfoPageSection {
  title: string;
  description?: string;
  bullets?: string[];
  cards?: InfoPageCard[];
  note?: string;
}

interface InfoPageStat {
  label: string;
  value: string;
  description?: string;
}

interface InfoPageCta {
  title: string;
  description: string;
  primary?: {
    label: string;
    href: string;
  };
  secondary?: {
    label: string;
    href: string;
  };
}

interface InfoPageProps {
  title: string;
  description: string;
  badge?: string;
  sections: InfoPageSection[];
  stats?: InfoPageStat[];
  cta?: InfoPageCta;
  lastUpdated?: string;
}

export function InfoPage({
  title,
  description,
  badge,
  sections,
  stats,
  cta,
  lastUpdated,
}: InfoPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <section className="container py-16 sm:py-24">
        <div className="max-w-3xl space-y-6">
          {badge && (
            <Badge variant="outline" className="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
              {badge}
            </Badge>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {description}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdated}</p>
          )}
        </div>
      </section>

      {stats && stats.length > 0 && (
        <section className="container pb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70"
              >
                <p className="text-sm font-medium text-primary-600 dark:text-primary-300">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container pb-16 sm:pb-24">
        <div className="grid gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
                  {section.description && (
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {section.description}
                    </p>
                  )}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="grid gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {section.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.cards && section.cards.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.cards.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
                      >
                        <div className="space-y-3">
                          {card.tag && (
                            <Badge variant="outline" className="text-xs uppercase tracking-wide">
                              {card.tag}
                            </Badge>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {card.description}
                          </p>
                          {card.href && card.linkLabel && (
                            <Link
                              href={card.href}
                              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                            >
                              {card.linkLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.note && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
                    {section.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {cta && (
        <section className="container pb-24">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-500 p-8 text-white shadow-lg sm:p-12">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-semibold">{cta.title}</h2>
              <p className="text-base text-white/80">{cta.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {cta.primary && (
                  <Link
                    href={cta.primary.href}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-md transition hover:scale-105"
                  >
                    {cta.primary.label}
                  </Link>
                )}
                {cta.secondary && (
                  <Link
                    href={cta.secondary.href}
                    className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {cta.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

