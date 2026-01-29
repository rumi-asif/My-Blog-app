import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { PostWithAuthor } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const author = searchParams.get('author');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status') || 'PUBLISHED';

    // Build where clause
    const where: Prisma.PostWhereInput = {
      status: status as any,
    };

    // Add search query
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { author: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    // Add category filter
    if (category) {
      where.categoryId = category;
    }

    // Add tags filter
    if (tags.length > 0) {
      where.tags = {
        some: {
          slug: { in: tags },
        },
      };
    }

    // Add author filter
    if (author) {
      where.authorId = author;
    }

    // Add date range filter
    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }

    // Build orderBy clause
    let orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { publishedAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { publishedAt: 'asc' };
        break;
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'mostLiked':
        orderBy = { likes: { _count: 'desc' } };
        break;
      case 'mostCommented':
        orderBy = { comments: { _count: 'desc' } };
        break;
      case 'relevance':
      default:
        // For relevance, prioritize by views then by publish date
        orderBy = { views: 'desc' };
    }

    // Execute search with pagination
    const [posts, totalCount] = await Promise.all([
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
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // Get facets for filters
    const [categories, popularTags] = await Promise.all([
      prisma.category.findMany({
        where: {
          posts: {
            some: where,
          },
        },
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.tag.findMany({
        where: {
          posts: {
            some: where,
          },
        },
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
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Search suggestions (if query is short)
    let suggestions: string[] = [];
    if (query && query.length >= 2 && query.length < 10) {
      const similarPosts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: { title: true },
        take: 5,
      });
      
      suggestions = [...new Set(similarPosts.map(p => {
        const words = p.title.toLowerCase().split(' ');
        return words.find(w => w.includes(query.toLowerCase())) || '';
      }).filter(Boolean))];
    }

    return NextResponse.json({
      posts: posts as PostWithAuthor[],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      facets: {
        categories,
        tags: popularTags,
      },
      suggestions,
      query: {
        q: query,
        category,
        tags,
        author,
        sortBy,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
