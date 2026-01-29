import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { autoFeaturePosts, unfeatureOldPosts } from '@/lib/auto-feature';
import { invalidateCache } from '@/lib/cache';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Run auto-feature and unfeature old posts
    const featuredCount = await autoFeaturePosts();
    const unfeaturedCount = await unfeatureOldPosts();

    // Invalidate cache
    invalidateCache('featured-posts');
    invalidateCache('featured');

    return NextResponse.json({
      success: true,
      featured: featuredCount,
      unfeatured: unfeaturedCount,
      message: `Auto-featured ${featuredCount} posts and unfeatured ${unfeaturedCount} old posts`,
    });
  } catch (error) {
    console.error('Auto-feature error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

