# Surendra Kancharla - Transportation Universe Portfolio

This is the GitHub Pages deployment for Surendra Kancharla's interactive 3D portfolio showcasing transportation research and engineering expertise.

## Deployment

This site is deployed using GitHub Pages with the following configuration:

### Fixed Issues:
1. **Path Configuration**: All absolute paths (`/_next/`, `/icons/`, etc.) have been converted to relative paths to work with GitHub Pages
2. **GitHub Actions**: Configured static deployment workflow for automatic updates
3. **Service Worker**: Updated paths to work with the GitHub Pages environment
4. **Manifest**: Updated Progressive Web App manifest with relative paths

### GitHub Pages Settings:
- **Source**: Deploy from a branch
- **Branch**: `master` 
- **Folder**: `/ (root)`

### Files Modified:
- All HTML files: Updated `/_next/` paths to relative paths
- `manifest.json`: Updated icon paths and scope to relative paths
- `sw.js`: Service worker with corrected paths
- Added GitHub Actions workflow in `.github/workflows/static.yml`

### How to Update:
1. Build your Next.js application with proper `basePath` configuration
2. Copy the output to this repository
3. Run the path fixing script: `node fix-paths.js`
4. Commit and push changes
5. GitHub Actions will automatically deploy to Pages

## Original Application

This is a Next.js application featuring:
- Interactive 3D universe built with Three.js
- Transportation research portfolio
- Engineering project showcase
- Responsive design with dark/light theme support
- Progressive Web App capabilities

## Live Site

Visit: [https://surendrark.github.io](https://surendrark.github.io)
