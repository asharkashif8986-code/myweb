# Pulse — Social Activity React Website

A modern responsive social activity dashboard built with React, Vite, JavaScript and CSS.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Create a GitHub repository, e.g. `social-activity`.
2. Upload all files/folders from this project.
3. GitHub repository → Settings → Pages.
4. For a simple Vite deployment, the easiest option is GitHub Actions.
5. Create `.github/workflows/deploy.yml` using the workflow shown below.

### GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy React to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then go to Settings → Pages and set Source to **GitHub Actions**.

## Important

If the repository is not your root user site, Vite may need a base path. For repository `social-activity`, add this to `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/social-activity/'
})
```

Then rebuild.

## Included

- React SPA
- Responsive layout
- Dark/light mode
- Search
- Like/unlike
- Comments
- Create post modal
- LocalStorage persistence
- Notifications panel
- Stories
- Trending section
- People suggestions
- Mobile sidebar
- SVG placeholder artwork and avatars
