import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in correct order (respecting foreign key constraints)
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleared!');
  console.log('\n🌱 Starting database seed...\n');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nextgenblog.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'Platform administrator and content moderator',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      website: 'https://nextgenblog.com',
      twitter: '@nextgenblog',
      points: 1000,
      level: 5,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  const writerPassword = await bcrypt.hash('writer123', 10);
  const writer1 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      password: writerPassword,
      role: 'WRITER',
      bio: 'Tech enthusiast and full-stack developer. Passionate about sharing knowledge through writing.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      website: 'https://sarahjohnson.dev',
      twitter: '@sarahjdev',
      github: 'sarahjohnson',
      linkedin: 'sarah-johnson',
      points: 450,
      level: 3,
    },
  });
  console.log('✅ Created writer:', writer1.email);

  const writer2 = await prisma.user.create({
    data: {
      email: 'mike.chen@example.com',
      name: 'Mike Chen',
      password: writerPassword,
      role: 'WRITER',
      bio: 'Software architect and blogger. Love writing about clean code and system design.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      website: 'https://mikechen.io',
      github: 'mikechen',
      points: 320,
      level: 2,
    },
  });
  console.log('✅ Created writer:', writer2.email);

  const readerPassword = await bcrypt.hash('reader123', 10);
  const readers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'emma.wilson@example.com',
        name: 'Emma Wilson',
        password: readerPassword,
        role: 'READER',
        bio: 'Lifelong learner and tech enthusiast',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        points: 120,
        level: 1,
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.brown@example.com',
        name: 'James Brown',
        password: readerPassword,
        role: 'READER',
        bio: 'Developer and avid reader',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        points: 85,
        level: 1,
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.martinez@example.com',
        name: 'Lisa Martinez',
        password: readerPassword,
        role: 'READER',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        points: 60,
        level: 1,
      },
    }),
  ]);
  console.log('✅ Created readers:', readers.length);

  // Create categories
  const techCategory = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest tech news, tutorials, and programming guides',
      color: '#3b82f6',
      icon: '💻',
    },
  });

  const webDevCategory = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern web development techniques and frameworks',
      color: '#8b5cf6',
      icon: '🌐',
    },
  });

  const lifestyleCategory = await prisma.category.create({
    data: {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Tips for better living and personal growth',
      color: '#ec4899',
      icon: '🌟',
    },
  });

  const businessCategory = await prisma.category.create({
    data: {
      name: 'Business',
      slug: 'business',
      description: 'Business insights, strategies, and entrepreneurship',
      color: '#f59e0b',
      icon: '💼',
    },
  });

  console.log('✅ Created categories: 4');

  // Create tags
  const tagsData = [
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'React', slug: 'react' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Prisma', slug: 'prisma' },
    { name: 'TailwindCSS', slug: 'tailwindcss' },
    { name: 'API', slug: 'api' },
    { name: 'Database', slug: 'database' },
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'Best Practices', slug: 'best-practices' },
    { name: 'Performance', slug: 'performance' },
  ];

  const tags = await Promise.all(
    tagsData.map((tag) => prisma.tag.create({ data: tag }))
  );
  console.log('✅ Created tags:', tags.length);

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js 14: A Complete Guide',
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn how to build modern web applications with Next.js 14, including App Router, Server Components, and more.',
      content: `<h2>Introduction to Next.js 14</h2>
<p>Next.js 14 brings exciting new features and improvements that make building React applications easier than ever. In this comprehensive guide, we'll explore everything you need to know to get started.</p>

<h2>What's New in Next.js 14?</h2>
<ul>
  <li><strong>Server Actions:</strong> Simplified data mutations without API routes</li>
  <li><strong>Improved Performance:</strong> Faster builds and runtime optimizations</li>
  <li><strong>Enhanced Metadata API:</strong> Better SEO out of the box</li>
  <li><strong>Streaming and Suspense:</strong> Progressive rendering for better UX</li>
</ul>

<h2>Setting Up Your First Project</h2>
<pre><code>npx create-next-app@latest my-app
cd my-app
npm run dev</code></pre>

<h2>App Router vs Pages Router</h2>
<p>Next.js 14 recommends using the App Router for new projects. It provides better performance and developer experience with features like:</p>
<ul>
  <li>Layouts and nested routing</li>
  <li>Server and Client Components</li>
  <li>Streaming and Suspense</li>
  <li>Built-in loading and error states</li>
</ul>

<h2>Conclusion</h2>
<p>Next.js 14 is a powerful framework that combines the best of React with server-side rendering, static generation, and much more. Start building today!</p>`,
      status: 'PUBLISHED',
      featured: true,
      readTime: 8,
      views: 1245,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      authorId: writer1.id,
      categoryId: webDevCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      metaTitle: 'Getting Started with Next.js 14 - Complete Tutorial',
      metaDescription: 'Learn Next.js 14 from scratch with this comprehensive guide covering App Router, Server Components, and modern web development.',
      keywords: ['nextjs', 'react', 'tutorial', 'web development'],
      tags: {
        connect: [
          { id: tags[0].id }, // Next.js
          { id: tags[1].id }, // React
          { id: tags[2].id }, // TypeScript
          { id: tags[9].id }, // Tutorial
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-nodejs-express',
      excerpt: 'A practical guide to creating robust and scalable REST APIs using Node.js, Express, and best practices.',
      content: `<h2>Why REST APIs?</h2>
<p>REST (Representational State Transfer) is the most popular architectural style for building web APIs. It's simple, scalable, and works seamlessly with HTTP.</p>

<h2>Setting Up Express</h2>
<pre><code>npm install express
npm install --save-dev @types/express typescript</code></pre>

<h2>Creating Your First Endpoint</h2>
<pre><code>import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});</code></pre>

<h2>Best Practices</h2>
<ul>
  <li>Use proper HTTP methods (GET, POST, PUT, DELETE)</li>
  <li>Implement error handling middleware</li>
  <li>Use environment variables for configuration</li>
  <li>Add request validation</li>
  <li>Implement rate limiting</li>
  <li>Use proper status codes</li>
</ul>`,
      status: 'PUBLISHED',
      featured: true,
      readTime: 10,
      views: 892,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      authorId: writer2.id,
      categoryId: techCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      tags: {
        connect: [
          { id: tags[4].id }, // Node.js
          { id: tags[3].id }, // JavaScript
          { id: tags[7].id }, // API
          { id: tags[10].id }, // Best Practices
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Mastering TypeScript: Advanced Types and Patterns',
      slug: 'mastering-typescript-advanced-types',
      excerpt: 'Deep dive into TypeScript\'s advanced type system including generics, utility types, and type inference.',
      content: `<h2>Why TypeScript?</h2>
<p>TypeScript adds static typing to JavaScript, catching errors at compile-time and improving code quality and developer experience.</p>

<h2>Advanced Type Features</h2>
<h3>1. Generics</h3>
<pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

const result = identity&lt;string&gt;("hello");</code></pre>

<h3>2. Utility Types</h3>
<pre><code>type User = {
  id: string;
  name: string;
  email: string;
};

type PartialUser = Partial&lt;User&gt;;
type ReadonlyUser = Readonly&lt;User&gt;;
type UserWithoutEmail = Omit&lt;User, 'email'&gt;;</code></pre>

<h3>3. Conditional Types</h3>
<pre><code>type IsString&lt;T&gt; = T extends string ? true : false;</code></pre>

<h2>Practical Tips</h2>
<ul>
  <li>Use strict mode for maximum type safety</li>
  <li>Leverage type inference when possible</li>
  <li>Create reusable generic types</li>
  <li>Use const assertions for literal types</li>
</ul>`,
      status: 'PUBLISHED',
      featured: false,
      readTime: 12,
      views: 654,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      authorId: writer1.id,
      categoryId: techCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      tags: {
        connect: [
          { id: tags[2].id }, // TypeScript
          { id: tags[3].id }, // JavaScript
          { id: tags[10].id }, // Best Practices
        ],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Database Design with Prisma ORM',
      slug: 'database-design-prisma-orm',
      excerpt: 'Learn how to design and manage your database schema using Prisma, the modern TypeScript ORM.',
      content: `<h2>What is Prisma?</h2>
<p>Prisma is a next-generation ORM that makes database access easy with type-safe queries and an intuitive data model.</p>

<h2>Schema Design</h2>
<pre><code>model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}</code></pre>

<h2>Key Features</h2>
<ul>
  <li>Type-safe database queries</li>
  <li>Auto-generated migrations</li>
  <li>Intuitive data modeling</li>
  <li>Built-in connection pooling</li>
  <li>Support for multiple databases</li>
</ul>

<h2>Querying Data</h2>
<pre><code>const users = await prisma.user.findMany({
  include: {
    posts: true
  },
  where: {
    email: {
      contains: '@example.com'
    }
  }
});</code></pre>`,
      status: 'PUBLISHED',
      featured: false,
      readTime: 7,
      views: 523,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      authorId: writer2.id,
      categoryId: techCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      tags: {
        connect: [
          { id: tags[5].id }, // Prisma
          { id: tags[8].id }, // Database
          { id: tags[2].id }, // TypeScript
        ],
      },
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: '10 Productivity Tips for Developers',
      slug: '10-productivity-tips-for-developers',
      excerpt: 'Boost your productivity with these proven tips and techniques used by successful developers worldwide.',
      content: `<h2>Introduction</h2>
<p>As developers, we're always looking for ways to be more productive. Here are 10 tips that have worked for me and countless others.</p>

<h2>The Tips</h2>
<ol>
  <li><strong>Use keyboard shortcuts</strong> - Master your IDE shortcuts</li>
  <li><strong>Time blocking</strong> - Dedicate specific time blocks for deep work</li>
  <li><strong>Automate repetitive tasks</strong> - Write scripts for common tasks</li>
  <li><strong>Take regular breaks</strong> - Use the Pomodoro technique</li>
  <li><strong>Keep learning</strong> - Dedicate time daily for learning new things</li>
  <li><strong>Document as you go</strong> - Write docs while coding, not after</li>
  <li><strong>Use version control effectively</strong> - Commit often with clear messages</li>
  <li><strong>Practice code reviews</strong> - Learn from others' code</li>
  <li><strong>Set up a good development environment</strong> - Invest in your tools</li>
  <li><strong>Exercise and stay healthy</strong> - A healthy body = a sharp mind</li>
</ol>

<h2>Conclusion</h2>
<p>Productivity isn't about working more hours—it's about working smarter. Try these tips and see what works for you!</p>`,
      status: 'PUBLISHED',
      featured: false,
      readTime: 5,
      views: 1103,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      authorId: writer1.id,
      categoryId: lifestyleCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      tags: {
        connect: [
          { id: tags[10].id }, // Best Practices
        ],
      },
    },
  });

  const post6 = await prisma.post.create({
    data: {
      title: 'Starting Your Tech Startup: A Founder\'s Journey',
      slug: 'starting-tech-startup-founders-journey',
      excerpt: 'Lessons learned from building a tech startup from scratch, including funding, team building, and product development.',
      content: `<h2>The Beginning</h2>
<p>Every startup journey begins with an idea. Mine started two years ago when I noticed a gap in the market.</p>

<h2>Key Lessons</h2>
<h3>1. Validate Before Building</h3>
<p>Talk to potential customers before writing a single line of code.</p>

<h3>2. Build a Strong Team</h3>
<p>Your team is everything. Hire people who complement your skills.</p>

<h3>3. Focus on Product-Market Fit</h3>
<p>Don't scale until you've found it.</p>

<h3>4. Fundraising is Time-Consuming</h3>
<p>Budget 6+ months for raising capital.</p>

<h2>Advice for Aspiring Founders</h2>
<ul>
  <li>Start small and iterate</li>
  <li>Listen to your customers</li>
  <li>Be prepared for failures</li>
  <li>Network constantly</li>
  <li>Take care of your mental health</li>
</ul>`,
      status: 'PUBLISHED',
      featured: true,
      readTime: 9,
      views: 743,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      authorId: writer2.id,
      categoryId: businessCategory.id,
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      tags: {
        connect: [],
      },
    },
  });

  console.log('✅ Created posts: 6');

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! This really helped me understand Next.js 14 better.',
        postId: post1.id,
        authorId: readers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for the detailed explanation. The code examples are very clear.',
        postId: post1.id,
        authorId: readers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Could you cover Server Actions in more detail? Would love to see more examples.',
        postId: post1.id,
        authorId: readers[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'This is exactly what I needed! The Express setup is straightforward.',
        postId: post2.id,
        authorId: readers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The best practices section is gold. Implementing these in my project now.',
        postId: post2.id,
        authorId: readers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'TypeScript generics finally make sense! Thank you for this explanation.',
        postId: post3.id,
        authorId: readers[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Prisma has been a game-changer for my projects. Great tutorial!',
        postId: post4.id,
        authorId: readers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'These productivity tips are practical and actually work. Thanks!',
        postId: post5.id,
        authorId: readers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'As a fellow founder, I can relate to every single point. Great read!',
        postId: post6.id,
        authorId: readers[2].id,
      },
    }),
  ]);
  console.log('✅ Created comments:', comments.length);

  // Create nested replies
  await prisma.comment.create({
    data: {
      content: 'I\'m planning to write a follow-up article on Server Actions. Stay tuned!',
      postId: post1.id,
      authorId: writer1.id,
      parentId: comments[2].id,
    },
  });

  // Create likes
  const allPosts = [post1, post2, post3, post4, post5, post6];
  for (const post of allPosts) {
    for (const reader of readers) {
      // Random likes (70% chance)
      if (Math.random() > 0.3) {
        await prisma.like.create({
          data: {
            userId: reader.id,
            postId: post.id,
          },
        });
      }
    }
  }
  console.log('✅ Created likes');

  // Create bookmarks
  await Promise.all([
    prisma.bookmark.create({
      data: { userId: readers[0].id, postId: post1.id },
    }),
    prisma.bookmark.create({
      data: { userId: readers[0].id, postId: post3.id },
    }),
    prisma.bookmark.create({
      data: { userId: readers[1].id, postId: post2.id },
    }),
    prisma.bookmark.create({
      data: { userId: readers[1].id, postId: post4.id },
    }),
    prisma.bookmark.create({
      data: { userId: readers[2].id, postId: post1.id },
    }),
  ]);
  console.log('✅ Created bookmarks: 5');

  // Create subscriptions
  await Promise.all([
    prisma.subscription.create({
      data: {
        email: 'subscriber1@example.com',
        userId: readers[0].id,
      },
    }),
    prisma.subscription.create({
      data: {
        email: 'subscriber2@example.com',
        userId: readers[1].id,
      },
    }),
    prisma.subscription.create({
      data: {
        email: 'newsletter@example.com',
      },
    }),
  ]);
  console.log('✅ Created subscriptions: 3');

  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin:');
  console.log('   Email: admin@nextgenblog.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('✍️  Writers:');
  console.log('   Email: sarah.johnson@example.com');
  console.log('   Password: writer123');
  console.log('   ');
  console.log('   Email: mike.chen@example.com');
  console.log('   Password: writer123');
  console.log('');
  console.log('👤 Readers:');
  console.log('   Email: emma.wilson@example.com');
  console.log('   Password: reader123');
  console.log('   ');
  console.log('   Email: james.brown@example.com');
  console.log('   Password: reader123');
  console.log('   ');
  console.log('   Email: lisa.martinez@example.com');
  console.log('   Password: reader123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Data Summary:');
  console.log('   • 7 users (1 admin, 2 writers, 3 readers)');
  console.log('   • 4 categories');
  console.log('   • 12 tags');
  console.log('   • 6 published posts');
  console.log('   • 10 comments (with nested replies)');
  console.log('   • ~12-18 likes');
  console.log('   • 5 bookmarks');
  console.log('   • 3 email subscriptions');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
