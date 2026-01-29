import { Suspense } from 'react';
import { PostCard } from '@/components/post-card';
import { prisma } from '@/lib/prisma';
import { getCachedOrFetch } from '@/lib/cache';
import type { PostWithAuthor } from '@/types';
import { ExplorePageClient } from './page-client';

async function getPosts(): Promise<PostWithAuthor[]> {
  return getCachedOrFetch('explore-posts', async () => {
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
      take: 20,
    });
    return posts as PostWithAuthor[];
  }, 300);
}

async function getCategories() {
  return getCachedOrFetch('categories', async () => {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }, 600);
}

async function getTrendingTags() {
  return getCachedOrFetch('trending-tags', async () => {
    return await prisma.tag.findMany({
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
      take: 20,
    });
  }, 600);
}

export default async function ExplorePage() {
  const [posts, categories, tags] = await Promise.all([
    getPosts(),
    getCategories(),
    getTrendingTags(),
  ]);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover amazing content from writers around the world
          </p>
        </div>

        <ExplorePageClient
          initialPosts={posts}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
}

