# portfolio

Linh Tran's portfolio — a static site (plain HTML/CSS) built from the Figma file "Portfolio".

- `index.html` — Work (home)
- `case-studies/` — case study pages
- `css/styles.css` — shared design tokens, nav, footer
- `assets/` — images exported from Figma

## Local preview

```sh
python3 -m http.server 8000
```

## Deploy

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
