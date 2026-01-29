import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      const likesCount = await prisma.like.count({
        where: { postId: params.postId },
      });

      return NextResponse.json({ liked: false, likesCount });
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: params.postId,
        },
      });

      const likesCount = await prisma.like.count({
        where: { postId: params.postId },
      });

      // Create notification for post author
      const post = await prisma.post.findUnique({
        where: { id: params.postId },
        select: { authorId: true, title: true },
      });

      if (post && post.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'LIKE',
            title: 'New Like',
            message: `${session.user.name} liked your post "${post.title}"`,
            link: `/post/${params.postId}`,
          },
        });
      }

      return NextResponse.json({ liked: true, likesCount });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

