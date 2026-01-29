import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
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

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'WRITER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true, publishedAt: true },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      readTime,
      scheduledFor,
    } = body;

    // Handle category
    let categoryId = null;
    if (category) {
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await prisma.category.create({
          data: {
            name: category,
            slug: categorySlug,
          },
        });
        categoryId = newCategory.id;
      }
    }

    // Handle tags
    const tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
        const existingTag = await prisma.tag.findUnique({
          where: { slug: tagSlug },
        });

        if (existingTag) {
          tagIds.push(existingTag.id);
        } else {
          const newTag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagSlug,
            },
          });
          tagIds.push(newTag.id);
        }
      }
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: params.postId },
      data: {
        title,
        excerpt,
        content,
        coverImage,
        status,
        readTime,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : undefined,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        categoryId,
        tags: {
          set: [],
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    // Invalidate cache
    invalidateCache('posts');
    invalidateCache('featured');
    invalidateCache('recent');

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isAuthor = post.authorId === session.user.id;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    await prisma.post.delete({ where: { id: params.postId } });

    invalidateCache('posts');
    invalidateCache('featured');
    invalidateCache('recent');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

