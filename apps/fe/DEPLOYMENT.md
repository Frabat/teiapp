# GitHub Pages Deployment Guide

This guide explains how to deploy the TEI App to GitHub Pages using automated GitHub Actions.

## 🚀 Quick Start

### 1. Repository Setup

Ensure your repository is named `teiapp` and is hosted on GitHub. The deployment is configured for the repository structure:
```
https://github.com/Frabat/teiapp
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 3. Configure Repository Secrets

If you're using Firebase or other environment variables, add them as repository secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### 4. Deploy

The application will automatically deploy when you push to the `main` or `master` branch.

## 🔧 Manual Deployment

If you prefer manual deployment:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Deployment Structure

### Build Output
- **Source**: `apps/fe/src/`
- **Build**: `apps/fe/dist/`
- **Deploy**: GitHub Pages from `dist/` directory

### File Organization
```
apps/fe/
├── src/           # Source code
├── public/        # Static assets
├── dist/          # Build output (auto-generated)
└── .github/       # GitHub Actions workflows
```

## 🌐 URL Structure

### Development
- **Local**: `http://localhost:3000`
- **Preview**: `http://localhost:4173`

### Production
- **GitHub Pages**: `https://frabat.github.io/teiapp`
- **Base Path**: `/teiapp/`

## ⚙️ Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/teiapp/' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          firebase: ['firebase'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### React Router Configuration
```typescript
const getBasePath = () => {
  if (process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io')) {
    return '/teiapp';
  }
  return '/';
};
```

## 🔄 GitHub Actions Workflow

### Workflow File: `.github/workflows/deploy.yml`

The workflow automatically:
1. **Triggers** on push to main/master branch
2. **Builds** the application using Node.js 18
3. **Deploys** to GitHub Pages
4. **Handles** SPA routing with 404.html fallback

### Workflow Steps
1. **Checkout**: Clone repository
2. **Setup Node.js**: Install Node.js 18 with caching
3. **Install Dependencies**: Run `npm ci`
4. **Build Application**: Run `npm run build`
5. **Setup Pages**: Configure GitHub Pages
6. **Upload Artifact**: Upload dist folder
7. **Deploy**: Deploy to GitHub Pages

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript compilation errors

#### Routing Issues
- Ensure 404.html is in the public folder
- Verify base path configuration
- Check React Router basename setting

#### Environment Variables
- Verify all Firebase environment variables are set
- Check repository secrets configuration
- Ensure variables are prefixed with `VITE_`

#### Deployment Failures
- Check GitHub Actions permissions
- Verify Pages source is set to GitHub Actions
- Check workflow file syntax

### Debug Commands

```bash
# Check build locally
npm run build:preview

# Check production build
NODE_ENV=production npm run build

# Verify dist folder contents
ls -la dist/

# Test local preview
npm run preview
```

## 📊 Performance Optimization

### Build Optimizations
- **Code Splitting**: Automatic chunk splitting by library
- **Tree Shaking**: Unused code elimination
- **Minification**: Production code compression
- **Asset Optimization**: Image and font optimization

### Chunk Strategy
```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],
  mui: ['@mui/material', '@mui/icons-material'],
  firebase: ['firebase'],
  redux: ['@reduxjs/toolkit', 'react-redux'],
  router: ['react-router-dom']
}
```

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to repository
- Use GitHub Secrets for sensitive configuration
- Prefix client-side variables with `VITE_`

### Build Security
- Regular dependency updates
- Security scanning in CI/CD
- Production build validation

## 📈 Monitoring and Analytics

### GitHub Pages Analytics
- Built-in GitHub Pages analytics
- Performance monitoring
- Error tracking

### Application Monitoring
- Firebase Analytics integration
- Error boundary logging
- Performance metrics

## 🚀 Future Enhancements

### Potential Improvements
- **Service Worker**: Offline support
- **PWA**: Progressive Web App features
- **CDN**: Content delivery network
- **Custom Domain**: Professional domain setup

### Advanced Deployment
- **Staging Environment**: Pre-production testing
- **Rollback Strategy**: Quick deployment rollback
- **Blue-Green Deployment**: Zero-downtime updates

## 📚 Additional Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Support

For deployment issues:
1. Check GitHub Actions logs
2. Verify configuration files
3. Test locally with production build
4. Review troubleshooting section above

---

**Last Updated**: August 2024
**Version**: 1.0.0
