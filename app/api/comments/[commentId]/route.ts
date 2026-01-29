import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      select: { id: true, authorId: true },
    });
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = comment.authorId === session.user.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this comment' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({ where: { id: comment.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


