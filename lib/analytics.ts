import { prisma } from './prisma';

export async function trackPageView(data: {
  path: string;
  postId?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
}) {
  try {
    await prisma.analytics.create({
      data: {
        action: 'page_view',
        ...data,
      },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

export async function trackPostView(postId: string) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Post view tracking error:', error);
  }
}

export async function getPostAnalytics(postId: string) {
  const [post, views, likes, comments, bookmarks] = await Promise.all([
    prisma.post.findUnique({
      where: { id: postId },
      select: { views: true, createdAt: true },
    }),
    prisma.analytics.count({
      where: {
        postId,
        action: 'page_view',
      },
    }),
    prisma.like.count({
      where: { postId },
    }),
    prisma.comment.count({
      where: { postId },
    }),
    prisma.bookmark.count({
      where: { postId },
    }),
  ]);

  return {
    views: post?.views || 0,
    analyticsViews: views,
    likes,
    comments,
    bookmarks,
    createdAt: post?.createdAt,
  };
}

export async function getDashboardAnalytics(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const [totalPosts, totalViews, totalLikes, totalComments, recentPosts, postsLast30Days, viewsLast30Days, likesLast30Days, commentsLast30Days] = await Promise.all([
    prisma.post.count({
      where: { authorId: userId },
    }),
    prisma.post.aggregate({
      where: { authorId: userId },
      _sum: {
        views: true,
      },
    }),
    prisma.like.count({
      where: {
        post: {
          authorId: userId,
        },
      },
    }),
    prisma.comment.count({
      where: {
        post: {
          authorId: userId,
        },
      },
    }),
    prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.post.aggregate({
      where: {
        authorId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { views: true },
    }),
    prisma.like.count({
      where: {
        post: {
          authorId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      },
    }),
    prisma.comment.count({
      where: {
        post: {
          authorId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      },
    }),
  ]);

  // Generate chart data for last 7 days (simplified approach)
  const viewsByDay: Record<string, number> = {};
  const labels: string[] = [];
  const viewsData: number[] = [];
  
  // Get all posts to calculate daily views
  const allPosts = await prisma.post.findMany({
    where: { authorId: userId },
    select: {
      views: true,
      createdAt: true,
      publishedAt: true,
    },
  });
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    viewsByDay[dateKey] = 0;
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  // Distribute views across days (simple approximation - spread views across last 7 days)
  // For simplicity, we'll show views from posts created in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  allPosts.forEach((post) => {
    if (post.createdAt >= sevenDaysAgo) {
      const dateKey = post.createdAt.toISOString().split('T')[0];
      if (viewsByDay[dateKey] !== undefined) {
        viewsByDay[dateKey] += post.views || 0;
      }
    }
  });

  // If no recent posts, show a flat line with average
  const hasData = Object.values(viewsByDay).some(v => v > 0);
  if (!hasData && allPosts.length > 0) {
    const avgViews = Math.floor((totalViews._sum.views || 0) / 7);
    Object.keys(viewsByDay).forEach((key) => {
      viewsByDay[key] = avgViews;
    });
  }

  Object.values(viewsByDay).forEach((views) => {
    viewsData.push(views);
  });

  return {
    totalPosts,
    totalViews: totalViews._sum.views || 0,
    totalLikes,
    totalComments,
    recentPosts,
    postsLast30Days,
    viewsLast30Days: viewsLast30Days._sum.views || 0,
    likesLast30Days,
    commentsLast30Days,
    viewsChart: {
      data: viewsData,
      labels,
    },
  };
}

