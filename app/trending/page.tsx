import { TrendingUp, Flame } from 'lucide-react';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { getCachedOrFetch } from '@/lib/cache';
import type { PostWithAuthor } from '@/types';

async function getTrendingPosts(): Promise<PostWithAuthor[]> {
  return getCachedOrFetch('trending-posts', async () => {
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
      take: 20,
    });
    return posts as PostWithAuthor[];
  }, 600); // Cache for 10 minutes
}

export default async function TrendingPage() {
  const posts = await getTrendingPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Modern Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Flame className="h-5 w-5 text-orange-200" />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              What's Hot Right Now
            </h1>
            <p className="text-xl opacity-90">
              The most popular and engaging stories from the past week
            </p>
          </div>
        </div>
      </section>

      {/* Trending Content */}
      <section className="py-16">
        <div className="container">
          {posts.length > 0 ? (
            <div className="space-y-12">
              {/* Top 3 Trending - Hero Cards */}
              {posts.slice(0, 3).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Top Trending Stories
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {posts.slice(0, 3).map((post, index) => (
                      <div key={post.id} className="relative group">
                        <div className="absolute -top-3 -left-3 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-sm opacity-75 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                        <PostCard post={post} compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rest of Trending Posts */}
              {posts.slice(3).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        More Trending
                      </h2>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {posts.slice(3).length} more stories
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.slice(3).map((post, index) => (
                      <div key={post.id} className="relative group">
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                            {index + 4}
                          </div>
                        </div>
                        <PostCard post={post} compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 mb-6">
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                No trending posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for trending stories
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

