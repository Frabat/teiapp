# GitHub Pages Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Repository is named `teiapp`
- [ ] Repository is hosted on GitHub
- [ ] Repository is public (or you have GitHub Pro for private deployment)
- [ ] Main branch is `main` or `master`

### 2. GitHub Pages Configuration
- [ ] Go to repository Settings → Pages
- [ ] Source is set to "GitHub Actions"
- [ ] Custom domain is configured (if desired)
- [ ] HTTPS is enforced

### 3. Environment Variables
- [ ] Firebase configuration is set up
- [ ] Environment variables are configured in repository secrets:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
  - [ ] `VITE_FIREBASE_MEASUREMENT_ID`

### 4. Code Configuration
- [ ] Vite config has correct base path (`/teiapp/`)
- [ ] React Router has proper basename configuration
- [ ] 404.html file is in public directory
- [ ] All build scripts are working (`npm run build`)

### 5. Dependencies
- [ ] `gh-pages` package is installed
- [ ] All dependencies are up to date
- [ ] No TypeScript compilation errors
- [ ] Build completes successfully

## 🚀 Deployment Steps

### Step 1: Initial Setup
```bash
# Ensure you're in the correct directory
cd apps/fe

# Install dependencies
npm install

# Test build locally
npm run build

# Test preview
npm run preview
```

### Step 2: Manual Deployment (Optional)
```bash
# Deploy manually if needed
npm run deploy
```

### Step 3: Automated Deployment
1. **Push to Main Branch**: The GitHub Actions workflow will automatically trigger
2. **Monitor Workflow**: Check Actions tab for build progress
3. **Verify Deployment**: Check Pages tab for deployment status

## 🔍 Post-Deployment Verification

### 1. Application Access
- [ ] App is accessible at `https://username.github.io/teiapp`
- [ ] No console errors in browser
- [ ] All routes work correctly
- [ ] Authentication flows work

### 2. Functionality Testing
- [ ] File upload works
- [ ] TEI XML viewer displays correctly
- [ ] User authentication works
- [ ] File management operations work

### 3. Performance Check
- [ ] Page loads within reasonable time
- [ ] No major performance issues
- [ ] Assets are properly optimized
- [ ] Code splitting works correctly

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### Deployment Issues
- Check GitHub Actions logs
- Verify repository permissions
- Ensure Pages source is set to GitHub Actions
- Check workflow file syntax

#### Routing Issues
- Verify 404.html is in public directory
- Check React Router basename configuration
- Test with production build locally

#### Environment Variables
- Verify all Firebase variables are set
- Check variable naming (must start with `VITE_`)
- Ensure variables are in repository secrets

## 📊 Monitoring

### GitHub Pages Analytics
- Built-in analytics in repository Settings → Pages
- Monitor page views and performance
- Check for any deployment errors

### Application Monitoring
- Firebase Analytics (if configured)
- Error boundary logging
- Performance metrics

## 🔄 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor GitHub Actions performance
- [ ] Check for security vulnerabilities
- [ ] Review and update deployment configuration

### Updates
- [ ] Test locally before pushing
- [ ] Monitor deployment status
- [ ] Verify functionality after updates
- [ ] Rollback if necessary

## 📚 Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)

## 🆘 Support

If you encounter issues:
1. Check this checklist
2. Review GitHub Actions logs
3. Test locally with production build
4. Check troubleshooting section
5. Create an issue on GitHub

---

**Last Updated**: August 2024  
**Version**: 1.0.0
