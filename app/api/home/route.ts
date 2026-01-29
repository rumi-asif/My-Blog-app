import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCachedOrFetch } from '@/lib/cache';
import type { PostWithAuthor } from '@/types';

interface HomePageData {
  featuredPosts: PostWithAuthor[];
  trendingPosts: PostWithAuthor[];
  recentPosts: PostWithAuthor[];
  personalizedPosts?: PostWithAuthor[];
  trendingTags?: Array<{
    id: string;
    name: string;
    slug: string;
    _count: {
      posts: number;
    };
    featuredPost?: {
      id: string;
      title: string;
      slug: string;
      coverImage: string | null;
      excerpt: string | null;
    };
  }>;
  stats?: {
    totalPosts: number;
    totalWriters: number;
    totalReaders: number;
  };
}

async function getFeaturedPosts(): Promise<PostWithAuthor[]> {
  return getCachedOrFetch('featured-posts', async () => {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
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
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
    return posts as PostWithAuthor[];
  }, 300); // Cache for 5 minutes
}

async function getTrendingPosts(): Promise<PostWithAuthor[]> {
  return getCachedOrFetch('trending-posts-home', async () => {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
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
      orderBy: [
        { views: 'desc' },
        { likes: { _count: 'desc' } },
      ],
      take: 6,
    });
    return posts as PostWithAuthor[];
  }, 300);
}

async function getRecentPosts(): Promise<PostWithAuthor[]> {
  return getCachedOrFetch('recent-posts', async () => {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
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
      orderBy: { publishedAt: 'desc' },
      take: 9,
    });
    return posts as PostWithAuthor[];
  }, 300);
}

async function getPersonalizedPosts(userId: string): Promise<PostWithAuthor[]> {
  // Get user's reading history and followed authors
  const [readingHistory, followedAuthors] = await Promise.all([
    prisma.readingHistory.findMany({
      where: { userId },
      orderBy: { readAt: 'desc' },
      take: 10,
      include: {
        post: {
          include: {
            tags: true,
            category: true,
          },
        },
      },
    }),
    prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    }),
  ]);

  // Extract preferences from reading history
  const readTags = new Set<string>();
  const readCategories = new Set<string>();
  
  readingHistory.forEach(({ post }) => {
    if (post.categoryId) readCategories.add(post.categoryId);
    post.tags.forEach(tag => readTags.add(tag.id));
  });

  // Build personalized query
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        // Posts from followed authors
        { authorId: { in: followedAuthors.map(f => f.followingId) } },
        // Posts with similar tags
        { tags: { some: { id: { in: Array.from(readTags) } } } },
        // Posts from similar categories
        { categoryId: { in: Array.from(readCategories) } },
      ],
      // Exclude already read posts
      NOT: {
        id: { in: readingHistory.map(h => h.postId) },
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
    orderBy: [
      { publishedAt: 'desc' },
      { views: 'desc' },
    ],
    take: 6,
  });

  return posts as PostWithAuthor[];
}

async function getTrendingTags() {
  return getCachedOrFetch('trending-tags-home', async () => {
    const tags = await prisma.tag.findMany({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED',
            publishedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: 7,
    });

    // Get featured post for each tag (most recent or most viewed post with image)
    const tagsWithPosts = await Promise.all(
      tags.map(async (tag) => {
        const featuredPost = await prisma.post.findFirst({
          where: {
            status: 'PUBLISHED',
            tags: {
              some: {
                id: tag.id,
              },
            },
            coverImage: {
              not: null,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            excerpt: true,
          },
          orderBy: [
            { publishedAt: 'desc' },
            { views: 'desc' },
          ],
        });

        return {
          ...tag,
          featuredPost: featuredPost || undefined,
        };
      })
    );

    return tagsWithPosts;
  }, 600); // Cache for 10 minutes
}

async function getPlatformStats() {
  return getCachedOrFetch('platform-stats', async () => {
    const [totalPosts, totalWriters, totalReaders] = await Promise.all([
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count({ where: { posts: { some: {} } } }),
      prisma.user.count(),
    ]);

    return {
      totalPosts,
      totalWriters,
      totalReaders,
    };
  }, 3600); // Cache for 1 hour
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Base data for all users
    const [featuredPosts, trendingPosts, recentPosts, trendingTags, stats] = await Promise.all([
      getFeaturedPosts(),
      getTrendingPosts(),
      getRecentPosts(),
      getTrendingTags(),
      getPlatformStats(),
    ]);

    const data: HomePageData = {
      featuredPosts,
      trendingPosts,
      recentPosts,
      trendingTags,
      stats,
    };

    // Add personalized content for logged-in users
    if (session?.user?.id) {
      data.personalizedPosts = await getPersonalizedPosts(session.user.id);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch home page data' },
      { status: 500 }
    );
  }
}
