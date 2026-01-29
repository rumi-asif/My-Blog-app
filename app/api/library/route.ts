import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const [bookmarks, readingHistory, userPosts] = await Promise.all([
      // Bookmarks
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
      }),
      // Reading History
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
        take: 50,
      }),
      // User's Posts
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
      }),
    ]);

    return NextResponse.json({
      bookmarks: bookmarks.map((b) => b.post),
      readingHistory: readingHistory.map((rh) => ({
        ...rh.post,
        readAt: rh.readAt,
      })),
      userPosts,
    });
  } catch (error) {
    console.error('Library error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

