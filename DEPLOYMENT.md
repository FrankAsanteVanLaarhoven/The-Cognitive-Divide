# Deployment Guide - GitHub Pages

## 🚀 Deploying The Cognitive Divide Website

This guide will help you deploy your interactive book website to GitHub Pages for free hosting.

## 📋 Prerequisites

- GitHub account
- Repository already pushed to GitHub
- Basic knowledge of Git

## 🔧 Setup GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Go to your repository settings**
   - Navigate to [https://github.com/FrankAsanteVanLaarhoven/The-Cognitive-Divide](https://github.com/FrankAsanteVanLaarhoven/The-Cognitive-Divide)
   - Click on "Settings" tab

2. **Enable GitHub Pages**
   - Scroll down to "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch
   - Select "/ (root)" folder
   - Click "Save"

3. **Wait for deployment**
   - GitHub will automatically build and deploy your site
   - You'll see a green checkmark when deployment is complete
   - Your site will be available at: `https://frankasantevanlaarhoven.github.io/The-Cognitive-Divide/`

### Method 2: Manual Deployment

If you prefer manual control:

1. **Create a GitHub Actions workflow**
   - Create `.github/workflows/deploy.yml` file
   - Add the workflow configuration (see below)

2. **Push changes**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push
   ```

## 📁 GitHub Actions Workflow (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file**
   - Create `CNAME` file in your repository root
   - Add your domain: `yourdomain.com`

2. **Configure DNS**
   - Add CNAME record pointing to `frankasantevanlaarhoven.github.io`
   - Wait for DNS propagation (up to 24 hours)

3. **Enable HTTPS**
   - GitHub Pages automatically provides SSL certificates
   - Check "Enforce HTTPS" in repository settings

## 🔄 Updating Your Site

To update your live site:

```bash
# Make your changes
git add .
git commit -m "Update website content"
git push origin main
```

GitHub Pages will automatically rebuild and deploy your changes.

## 📊 Monitoring

- **Build status**: Check the "Actions" tab in your repository
- **Deployment logs**: View detailed logs in the Actions workflow
- **Site status**: Monitor at your GitHub Pages URL

## 🛠️ Troubleshooting

### Common Issues

1. **Site not updating**
   - Check if the build completed successfully
   - Clear browser cache
   - Wait a few minutes for changes to propagate

2. **404 errors**
   - Ensure `index.html` is in the root directory
   - Check file paths and case sensitivity

3. **Build failures**
   - Review the Actions logs for error details
   - Check for syntax errors in your code

### Performance Optimization

1. **Optimize images**
   - Compress PNG/JPEG files
   - Use WebP format when possible
   - Implement lazy loading

2. **Minimize file sizes**
   - Minify CSS and JavaScript
   - Remove unused code
   - Enable gzip compression

## 📈 Analytics

Consider adding Google Analytics:

1. **Get tracking ID** from Google Analytics
2. **Add tracking code** to your HTML files
3. **Monitor traffic** and user behavior

## 🔒 Security

- **HTTPS**: Always enabled on GitHub Pages
- **Content Security Policy**: Consider adding CSP headers
- **Regular updates**: Keep dependencies updated

## 📞 Support

- **GitHub Pages documentation**: [https://pages.github.com/](https://pages.github.com/)
- **GitHub Community**: [https://github.community/](https://github.community/)
- **Repository issues**: Use the Issues tab in your repository

---

*Your interactive book website is now live and accessible to the world!* 🌍
