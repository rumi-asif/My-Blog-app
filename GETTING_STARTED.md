# Getting Started with NextGen Blog

Welcome to NextGen Blog! This guide will help you set up and run the platform locally.

## Quick Start

### 1. Install Dependencies

```bash
cd next-gen-blog
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextgenblog?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# OAuth (Optional for development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (Optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="NextGen Blog"
```

### 3. Set Up Database

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d postgres
```

#### Option B: Local PostgreSQL

Install PostgreSQL and create a database:
```sql
CREATE DATABASE nextgenblog;
```

### 4. Run Database Migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Seed the Database (Optional)

```bash
npm run prisma:seed
```

This creates test accounts:
- **Admin**: admin@example.com / admin123
- **Writer**: writer@example.com / writer123
- **Reader**: reader@example.com / reader123

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## Setting Up OAuth (Optional but Recommended)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env`

## Setting Up Email (Optional but Recommended)

### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password in your `.env` as `SMTP_PASSWORD`

## Project Structure Overview

```
next-gen-blog/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API endpoints
│   ├── auth/              # Auth pages (signin, signup)
│   ├── dashboard/         # User dashboard
│   ├── write/             # Post editor
│   ├── explore/           # Browse posts
│   ├── post/[slug]/       # Individual post pages
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── editor/           # Rich text editor
│   ├── comments/         # Comment system
│   └── post/             # Post components
├── lib/                   # Utilities and helpers
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Auth configuration
│   ├── seo.ts            # SEO utilities
│   └── ...
├── prisma/                # Database schema
│   └── schema.prisma     # Database models
└── public/                # Static files
```

## Common Tasks

### Creating a New Post

1. Sign in as a writer or admin
2. Click "Write" in the navigation
3. Write your content using the rich text editor
4. Add tags and categories
5. Save as draft or publish immediately

### Managing Users (Admin Only)

1. Sign in as admin
2. Navigate to `/admin`
3. View all users and their activity
4. Moderate content and comments

### Viewing Analytics

1. Sign in and go to Dashboard
2. View your post statistics
3. See engagement metrics (views, likes, comments)

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
npx prisma db seed       # Seed database

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs      # View logs
```

## Features Overview

### For Readers
- 📚 Browse and search posts
- 💾 Bookmark favorite articles
- 💬 Comment and engage with content
- 🔔 Get notifications
- 📧 Subscribe to newsletters

### For Writers
- ✍️ Rich text editor
- 📊 Analytics dashboard
- 🗓️ Schedule posts
- 📝 Draft management
- 🏷️ Tags and categories

### For Admins
- 👥 User management
- 🛡️ Content moderation
- 📈 Platform analytics
- ⚙️ System configuration

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"

**Solution**:
1. Check if PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Ensure database exists

### OAuth Not Working

**Error**: "OAuth sign-in failed"

**Solution**:
1. Check client ID and secret
2. Verify redirect URIs match exactly
3. Clear browser cache and cookies

### Email Not Sending

**Error**: "Failed to send email"

**Solution**:
1. Check SMTP credentials
2. For Gmail, use App Password not regular password
3. Check firewall/network settings

### Build Errors

**Error**: "Module not found" or TypeScript errors

**Solution**:
```bash
rm -rf node_modules .next
npm install
npx prisma generate
npm run dev
```

## Next Steps

1. ✅ Customize branding in `lib/seo.ts`
2. ✅ Add your own content and categories
3. ✅ Configure email templates in `lib/email.ts`
4. ✅ Set up Google Analytics
5. ✅ Deploy to production (see DEPLOYMENT.md)
6. ✅ Invite users and start writing!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Support

Need help? Here are your options:

1. 📖 Check the [README.md](README.md)
2. 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md)
3. 💬 Open an issue on GitHub
4. 📧 Email: hello@nextgenblog.com

## License

MIT License - feel free to use this project for any purpose!

---

Happy blogging! 🎉

