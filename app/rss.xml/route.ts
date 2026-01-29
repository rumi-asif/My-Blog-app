import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextGen Blog';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME}</title>
    <link>${APP_URL}</link>
    <description>A next-generation blogging platform for modern writers and engaged readers</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${APP_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${APP_URL}/post/${post.slug}</link>
      <guid>${APP_URL}/post/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <author>${post.author.email} (${post.author.name})</author>
      <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

