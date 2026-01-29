import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedOrFetch } from '@/lib/cache';
import { calculateEngagementScore } from '@/lib/auto-feature';
import type { PostWithAuthor } from '@/types';

/**
 * Get the most trending blog post for the hero section
 * Based on likes, comments, and views from the past week
 */
async function getMostTrendingPost(): Promise<PostWithAuthor | null> {
  return getCachedOrFetch('most-trending-hero', async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get all published posts from the last week
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: oneWeekAgo,
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (posts.length === 0) {
      return null;
    }

    // Calculate engagement score for each post and sort
    const postsWithScore = posts
      .map((post) => {
        const views = post.views || 0;
        const likes = post._count.likes || 0;
        const comments = post._count.comments || 0;
        const bookmarks = post._count.bookmarks || 0;

        const engagementScore = calculateEngagementScore(
          views,
          likes,
          comments,
          bookmarks
        );

        return {
          ...post,
          engagementScore,
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore);

    // Return the top trending post
    return postsWithScore[0] as PostWithAuthor;
  }, 300); // Cache for 5 minutes
}

export async function GET() {
  try {
    const trendingPost = await getMostTrendingPost();

    if (!trendingPost) {
      return NextResponse.json(
        { message: 'No trending post found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trendingPost);
  } catch (error) {
    console.error('Error fetching most trending post:', error);
    return NextResponse.json(
      { message: 'Failed to fetch trending post' },
      { status: 500 }
    );
  }
}

