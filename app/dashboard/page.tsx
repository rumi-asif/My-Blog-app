import { redirect } from 'next/navigation';
import 'server-only';
import { getServerSession } from 'next-auth';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { getDashboardAnalytics } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { PostWithAuthor } from '@/types';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const isWriter = session.user.role === 'WRITER' || session.user.role === 'ADMIN';

  const [analytics, userPosts, bookmarks, readingHistory, following] = await Promise.all([
    getDashboardAnalytics(session.user.id),
    // Get user posts
    prisma.post.findMany({
      where: { authorId: session.user.id },
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
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    // Get bookmarks
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        post: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    // Get reading history
    prisma.readingHistory.findMany({
      where: { userId: session.user.id },
      include: {
        post: {
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
        },
      },
      orderBy: { readAt: 'desc' },
      take: 20,
    }),
    // Get following
    prisma.follow.findMany({
      where: { followerId: session.user.id },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const bookmarksData = bookmarks.map((b) => b.post) as PostWithAuthor[];
  const readingHistoryData = readingHistory.map((rh) => rh.post) as PostWithAuthor[];
  const followingData = following.map((f) => f.following);

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Welcome back, {session.user.name}! 👋
            </p>
          </div>
          {isWriter && (
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/write">
                <Edit className="mr-2 h-5 w-5" />
                Write New Post
              </Link>
            </Button>
          )}
        </div>

        {/* Interactive Dashboard Content */}
        <DashboardClient
          analytics={analytics}
          userPosts={userPosts as PostWithAuthor[]}
          bookmarks={bookmarksData}
          readingHistory={readingHistoryData}
          following={followingData}
          isWriter={isWriter}
        />
      </div>
    </div>
  );
}

