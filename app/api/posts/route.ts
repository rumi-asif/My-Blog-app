import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured) {
      where.featured = true;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'WRITER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      readTime,
      scheduledFor,
    } = body;

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: 'A post with this title already exists' },
        { status: 400 }
      );
    }

    // Create or find category
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

    // Create or find tags
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

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        readTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        authorId: session.user.id,
        categoryId,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    // Notify followers when post is published
    if (status === 'PUBLISHED') {
      const followers = await prisma.follow.findMany({
        where: { followingId: session.user.id },
        select: { followerId: true },
      });

      // Create notifications for all followers (non-blocking)
      Promise.all(
        followers.map((follow) =>
          prisma.notification.create({
            data: {
              userId: follow.followerId,
              type: 'NEW_POST',
              title: 'New Post from Writer You Follow',
              message: `${session.user.name} just published a new post: "${title}"`,
              link: `/post/${slug}`,
            },
          }).catch(console.error)
        )
      ).catch(console.error);
    }

    // Invalidate cache
    invalidateCache('posts');
    invalidateCache('featured');
    invalidateCache('recent');

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

