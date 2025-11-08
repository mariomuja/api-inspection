# Deployment Instructions

## Prerequisites
- GitHub account
- Vercel account (connect with GitHub)

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `api-inspection`
3. Make it public
4. Don't initialize with README (we already have one)
5. Click "Create repository"

## Step 2: Push Code to GitHub

From the project directory, run:

```bash
git push -u origin main
```

If you haven't configured git credentials, you may need to:
1. Create a Personal Access Token on GitHub
2. Use it as your password when pushing

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository `mariomuja/api-inspection`
3. Vercel will auto-detect the Angular framework
4. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm install && npm run build -- --configuration=production`
   - **Output Directory**: `frontend/dist/frontend/browser`
   - **Install Command**: `npm install`
5. Click "Deploy"

### Option B: Via Vercel CLI

Install Vercel CLI:
```bash
npm install -g vercel
```

Deploy:
```bash
vercel
```

Follow the prompts:
- Set up and deploy: Y
- Which scope: (your account)
- Link to existing project: N
- Project name: api-inspection
- Directory: ./
- Auto-detected framework: Other
- Override build settings: Y
  - Build Command: cd frontend && npm install && npm run build -- --configuration=production
  - Output Directory: frontend/dist/frontend/browser
  - Install Command: npm install

For production deployment:
```bash
vercel --prod
```

## Step 4: Verify Deployment

1. Once deployed, Vercel will provide a URL (e.g., `https://api-inspection.vercel.app`)
2. Visit the URL to test the application
3. Try selecting a service and running an analysis
4. Test the PDF export functionality

## Environment Variables

No environment variables are required for the basic setup. The app works out of the box.

## Updating the Deployment

After making changes:

1. Commit changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

2. Vercel will automatically redeploy on push to main branch

## Troubleshooting

### Build fails on Vercel
- Check that Node.js version is 18+ in Vercel settings
- Verify all dependencies are in package.json
- Check build logs for specific errors

### API endpoints not working
- Ensure the `api` folder is in the root directory
- Check that vercel.json is properly configured
- Verify serverless function routes in Vercel dashboard

### Frontend not loading
- Check the output directory configuration
- Ensure Angular build completed successfully
- Check browser console for errors

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Angular documentation: https://angular.dev
- Project issues: https://github.com/mariomuja/api-inspection/issues

