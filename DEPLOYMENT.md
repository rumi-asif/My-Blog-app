# Deployment Guide

This guide covers deploying NextGen Blog to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. A PostgreSQL database
2. OAuth credentials (Google, GitHub)
3. SMTP email configuration
4. Environment variables configured

## Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications.

### Steps:

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   Add the following in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   SMTP_HOST=...
   SMTP_PORT=...
   SMTP_USER=...
   SMTP_PASSWORD=...
   NEXT_PUBLIC_GA_ID=...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Database Setup**
   Run migrations on your production database:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Deploy**
   Vercel will automatically deploy on every push to main branch.

## AWS Deployment

### Using AWS Elastic Beanstalk:

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p node.js nextgen-blog
```

3. **Create environment**
```bash
eb create production
```

4. **Set environment variables**
```bash
eb setenv DATABASE_URL=... NEXTAUTH_SECRET=...
```

5. **Deploy**
```bash
eb deploy
```

### Using AWS ECS with Docker:

1. **Build Docker image**
```bash
docker build -t nextgen-blog .
```

2. **Push to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
docker tag nextgen-blog:latest YOUR_ECR_URL/nextgen-blog:latest
docker push YOUR_ECR_URL/nextgen-blog:latest
```

3. **Create ECS task definition and service** using AWS Console or CLI

## Digital Ocean

### Using App Platform:

1. **Connect GitHub repository**
2. **Configure build settings**
   - Build command: `npm run build`
   - Run command: `npm start`

3. **Add environment variables**
4. **Deploy**

## Self-Hosted with Docker

1. **Clone repository on server**
```bash
git clone https://github.com/yourusername/next-gen-blog.git
cd next-gen-blog
```

2. **Create .env file**
```bash
cp .env.example .env
# Edit .env with your production values
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Run migrations**
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

## Post-Deployment Checklist

- [ ] Test authentication (Google, GitHub, credentials)
- [ ] Verify database connections
- [ ] Test email functionality
- [ ] Check image uploads
- [ ] Verify SSL/HTTPS
- [ ] Test all major features
- [ ] Set up monitoring (Sentry, DataDog, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure custom domain
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test sitemap and RSS feed
- [ ] Set up Google Analytics

## Database Migrations

To run migrations in production:

```bash
npx prisma migrate deploy
```

To rollback (if needed):
```bash
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

## Monitoring

Recommended monitoring solutions:
- **Vercel Analytics** (if using Vercel)
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for traffic
- **UptimeRobot** for uptime monitoring

## Backup Strategy

1. **Database backups**: Daily automated backups
2. **Environment variables**: Keep secure backup
3. **Media files**: Use cloud storage with versioning

## Scaling Considerations

- Use CDN for static assets
- Enable database connection pooling
- Implement Redis for caching (optional)
- Use read replicas for database
- Set up load balancer for multiple instances

## Security

- Enable HTTPS/SSL
- Set up rate limiting
- Use environment variables for secrets
- Implement CORS policies
- Regular security audits
- Keep dependencies updated

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/yourusername/next-gen-blog/issues)
- Read [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Contact: hello@nextgenblog.com

