import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/post-card';
import type { PostWithAuthor } from '@/types';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const bookmarks = await prisma.bookmark.findMany({
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
  });

  const posts = bookmarks.map((b) => b.post) as PostWithAuthor[];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BookmarkIcon className="mr-3 h-8 w-8" />
            Your Bookmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Posts you've saved for later reading
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking posts to save them for later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

