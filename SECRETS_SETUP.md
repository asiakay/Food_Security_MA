# Environment Variables & Secrets Configuration

## For Cloudflare Pages Deployment

### Adding Secrets to Cloudflare Pages

1. Go to your Cloudflare Dashboard
2. Navigate to **Pages** → Your Project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

#### Production Environment
```
ANTHROPIC_API_KEY = sk-ant-api03-your-key-here
VITE_API_URL = https://your-api-url.com
NODE_ENV = production
```

#### Preview Environment (Optional)
Same variables for preview deployments

### For API/Backend Deployment

If deploying the API separately (e.g., Cloudflare Workers, Railway, Render):

**Cloudflare Workers:**
```bash
# Using Wrangler CLI
wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted
```

**Railway:**
1. Dashboard → Your Project → Variables
2. Add `ANTHROPIC_API_KEY`

**Render:**
1. Dashboard → Your Service → Environment
2. Add `ANTHROPIC_API_KEY`

## For GitHub Actions (Running Agents Automatically)

### Add GitHub Secrets

1. Go to your repository on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...`

### GitHub Actions Workflow

Create `.github/workflows/enrich-data.yml`:

```yaml
name: Enrich Data Weekly

on:
  schedule:
    # Run every Sunday at 2am UTC
    - cron: '0 2 * * 0'
  workflow_dispatch: # Manual trigger

jobs:
  enrich:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run enrichment agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run agent:enrich

      - name: Commit and push if changes
        run: |
          git config --global user.name 'AI Agent Bot'
          git config --global user.email 'bot@github.com'
          git add -A
          git diff --quiet && git diff --staged --quiet || (git commit -m "Auto: AI data enrichment" && git push)
```

## For Vercel

### Vercel Dashboard
1. Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY`
3. Select environments (Production, Preview, Development)

### Vercel CLI
```bash
vercel env add ANTHROPIC_API_KEY
```

## For Netlify

### Netlify Dashboard
1. Site Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY`

### Netlify CLI
```bash
netlify env:set ANTHROPIC_API_KEY sk-ant-api03-...
```

## Local Development (Optional)

If you ever need to test locally:

```bash
# Create .env file (already in .gitignore)
echo "ANTHROPIC_API_KEY=sk-ant-api03-your-key" > .env
```

## Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Add secrets through platform dashboards
- Use different keys for production/development
- Rotate API keys periodically
- Monitor API usage in Anthropic Console

❌ **DON'T:**
- Commit `.env` files to git
- Share API keys in chat/email
- Use production keys in preview environments
- Hardcode keys in source code

## Testing Secrets Are Working

### Test in Cloudflare Pages
After deploying, the build logs will show if environment variables are missing.

### Test in GitHub Actions
```yaml
- name: Test API Key
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    if [ -z "$ANTHROPIC_API_KEY" ]; then
      echo "Error: ANTHROPIC_API_KEY not set"
      exit 1
    fi
    echo "API Key is set ✓"
```

## Running Agents in the Cloud

### Option 1: GitHub Actions (Recommended)
- Free for public repos
- Scheduled runs
- Automatic commits
- See workflow file above

### Option 2: Cloudflare Workers Cron
- Deploy agents as Workers
- Use Cron Triggers for scheduling
- See Cloudflare Workers guide below

### Option 3: Cloud Functions
- Google Cloud Functions
- AWS Lambda
- Azure Functions
- Trigger via HTTP or schedule

## Cloudflare Workers Deployment (Advanced)

To run agents as Cloudflare Workers:

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Create `wrangler.toml`:
```toml
name = "food-security-agents"
main = "api/workers/enrich.ts"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 2 * * 0"] # Weekly on Sunday 2am
```

3. Deploy:
```bash
wrangler publish
```

## Get Your Anthropic API Key

1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-api03-`)
6. Add to your deployment platform

## Monitoring Usage

Track API usage and costs:
- Anthropic Console: https://console.anthropic.com/settings/usage
- Set usage limits to prevent overspending
- Enable email alerts for high usage

## Example: Cloudflare Pages Setup

```bash
# 1. Get API key from Anthropic
# Visit: https://console.anthropic.com/settings/keys

# 2. Add to Cloudflare Pages
# Dashboard → Pages → Your Project → Settings → Environment Variables

# Variable: ANTHROPIC_API_KEY
# Value: sk-ant-api03-xxxxxxxxxxxxx
# Environment: Production

# 3. Redeploy
# Pages will automatically use the new environment variable
```

## Troubleshooting

**"API key not found"**
- Verify secret name matches exactly: `ANTHROPIC_API_KEY`
- Check it's set for correct environment (production/preview)
- Redeploy after adding secrets

**"403 Forbidden"**
- API key may be invalid
- Regenerate key in Anthropic Console
- Update secret in deployment platform

**"Rate limited"**
- Check usage in Anthropic Console
- Increase delays in agent scripts
- Upgrade API plan if needed
