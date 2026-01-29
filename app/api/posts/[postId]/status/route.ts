import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ liked: false, bookmarked: false, likesCount: 0 });
    }

    const [like, bookmark, likesCount] = await Promise.all([
      prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: params.postId,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: params.postId,
          },
        },
      }),
      prisma.like.count({
        where: { postId: params.postId },
      }),
    ]);

    return NextResponse.json({
      liked: !!like,
      bookmarked: !!bookmark,
      likesCount,
    });
  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

