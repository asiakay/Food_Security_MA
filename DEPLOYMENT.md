# Cloudflare Pages Deployment Guide

## Build Settings for Cloudflare Pages

Use these settings when configuring your Cloudflare Pages deployment:

### Framework Preset
- **Framework preset**: `Vite` (or `None` if not available)

### Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave blank or use root)

### Environment Variables
No environment variables required for basic deployment.

### Node.js Version
- **Node.js version**: `18` or higher (Cloudflare Pages default is usually fine)

## Deployment Steps

### Option 1: Connect via Git (Recommended)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your repository: `asiakay/Food_Security_MA`
5. Configure build settings:
   ```
   Production branch: main (or your preferred branch)
   Build command: npm run build
   Build output directory: dist
   ```
6. Click **Save and Deploy**

### Option 2: Direct Upload

1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Go to Cloudflare Pages → **Create a project** → **Direct Upload**
3. Upload the `dist` folder
4. Done!

## Custom Domain (Optional)

1. After deployment, go to **Custom domains**
2. Add your domain (e.g., `food-security.yourdomain.com`)
3. Follow DNS configuration instructions
4. SSL/TLS is automatically configured

## Preview Deployments

Cloudflare Pages automatically creates preview deployments for:
- Every push to branches (not main/production)
- Pull requests

Preview URLs follow the pattern:
```
https://[commit-hash].[project-name].pages.dev
```

## Performance Optimization

Your site will automatically benefit from:
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ HTTP/2 and HTTP/3 support
- ✅ Brotli compression
- ✅ DDoS protection
- ✅ Web Analytics (optional)

## Troubleshooting

### Build Fails

If build fails, check:
- Node version (should be 16+)
- All dependencies in package.json
- Build command is correct: `npm run build`

### 404 Errors on Routes

If you add React Router later, create a `public/_redirects` file:
```
/*    /index.html   200
```

## Post-Deployment

After successful deployment:
1. Test the live URL: `https://[project-name].pages.dev`
2. Verify map functionality
3. Test all filters
4. Check mobile responsiveness

## Continuous Deployment

Once connected to Git:
- Every push to main → automatic production deployment
- Every push to other branches → automatic preview deployment
- Zero downtime deployments
- Instant rollback capability

---

**Estimated Build Time**: ~1-2 minutes
**Monthly Bandwidth**: Unlimited on free tier
**Monthly Builds**: 500/month on free tier
