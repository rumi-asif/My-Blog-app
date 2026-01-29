import { prisma } from './prisma';

/**
 * Calculate engagement score for a post
 * Formula: (views * 1) + (likes * 5) + (comments * 10) + (bookmarks * 3)
 */
export function calculateEngagementScore(
  views: number,
  likes: number,
  comments: number,
  bookmarks: number
): number {
  return views * 1 + likes * 5 + comments * 10 + bookmarks * 3;
}

/**
 * Auto-feature posts based on engagement metrics
 * Posts need to meet ALL criteria:
 * - Published in the last 30 days
 * - At least 100 views OR 50 likes OR 20 comments
 * - Engagement score >= 500
 * - Not already manually featured
 */
export async function autoFeaturePosts() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find posts that meet engagement criteria
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        featured: false, // Only check posts not already featured
        publishedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    const postsToFeature = posts.filter((post) => {
      const views = post.views || 0;
      const likes = post._count.likes || 0;
      const comments = post._count.comments || 0;
      const bookmarks = post._count.bookmarks || 0;

      // Check minimum thresholds
      const meetsMinimums =
        views >= 100 || likes >= 50 || comments >= 20;

      // Calculate engagement score
      const engagementScore = calculateEngagementScore(
        views,
        likes,
        comments,
        bookmarks
      );

      // Must meet minimums AND have high engagement score
      return meetsMinimums && engagementScore >= 500;
    });

    // Feature the top 3 posts by engagement score
    if (postsToFeature.length > 0) {
      // Sort by engagement score
      const sortedPosts = postsToFeature
        .map((post) => ({
          ...post,
          engagementScore: calculateEngagementScore(
            post.views || 0,
            post._count.likes || 0,
            post._count.comments || 0,
            post._count.bookmarks || 0
          ),
        }))
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 3); // Top 3 only

      // Update posts to be featured
      await Promise.all(
        sortedPosts.map((post) =>
          prisma.post.update({
            where: { id: post.id },
            data: { featured: true },
          })
        )
      );

      console.log(`✅ Auto-featured ${sortedPosts.length} posts based on engagement`);
      return sortedPosts.length;
    }

    return 0;
  } catch (error) {
    console.error('Error in auto-feature posts:', error);
    return 0;
  }
}

/**
 * Unfeature posts that no longer meet engagement criteria
 * (e.g., older than 30 days and below threshold)
 */
export async function unfeatureOldPosts() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find featured posts older than 30 days
    const oldFeaturedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
        publishedAt: {
          lt: thirtyDaysAgo,
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    // Check which ones no longer meet engagement threshold
    const postsToUnfeature = oldFeaturedPosts.filter((post) => {
      const views = post.views || 0;
      const likes = post._count.likes || 0;
      const comments = post._count.comments || 0;
      const bookmarks = post._count.bookmarks || 0;

      const engagementScore = calculateEngagementScore(
        views,
        likes,
        comments,
        bookmarks
      );

      // Unfeature if engagement is low (but keep if still very popular)
      return engagementScore < 300;
    });

    if (postsToUnfeature.length > 0) {
      await Promise.all(
        postsToUnfeature.map((post) =>
          prisma.post.update({
            where: { id: post.id },
            data: { featured: false },
          })
        )
      );

      console.log(`🔄 Unfeatured ${postsToUnfeature.length} old posts`);
      return postsToUnfeature.length;
    }

    return 0;
  } catch (error) {
    console.error('Error in unfeature old posts:', error);
    return 0;
  }
}

