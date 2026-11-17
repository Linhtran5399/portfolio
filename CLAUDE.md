# portfolio

Linh Tran's portfolio: a static site (plain HTML/CSS) built from the Figma file "Portfolio". See `README.md`.

## UI skills

### Visual verification
Playwright is installed (devDependency) for screenshot and animation verification. Chromium is preinstalled at `/opt/pw-browsers` in the cloud container.
This is a static site. Serve it with `python3 -m http.server 8000` and use `http://localhost:8000`. **Skill scripts default to port 3000, so override the URL to port 8000.**
Run `npx playwright install chromium` if screenshots fail elsewhere.
The installed Playwright (1.64) expects a newer Chromium build than the cloud container preinstalls. Launch with `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })` instead of downloading another.
Very long pages (e.g. `case-studies/cash-loan.html` at 375px, ~17,000px tall) occasionally render differently on the first pass. Retry a screenshot comparison before treating a mismatch as a regression.

### Accessibility scanning
axe-core is installed. /a11y uses it for programmatic WCAG 2.1 AA scanning. Known gaps found at setup: no skip-to-main link on `index.html` or the case studies (only in-page TOC "skip" links); `--fs-micro` is 10px.

### Token home
Design tokens live in `css/styles.css` (`:root`). /tokens reads and writes here. Shared colour, radius, type-size and spacing tokens now live only in `styles.css`; each `cs-*.css` keeps only its page-specific tokens (widths, section padding, a few component colours).
**Responsive tokens:** `--fs-display`, `--lh-display`, `--fs-h3`, `--lh-h2` and `--page-pad` are overridden inside `@media` blocks in `styles.css`. Never point a fixed-size value at them; use a fixed token such as `--fs-section` (32px) instead.

### Internationalisation
No i18n library detected. /copy edits strings directly in the HTML files.

### Design brief
Visual direction is documented in `DESIGN-BRIEF.md`. All UI skills read this before starting. Key constraints: light only, current font-size scale is not to be changed, single blue accent, flat rounded components, subtle motion.

### Skills available
| Skill | When to use |
|-------|------------|
| /design-grill | Before any UI work: establishes visual direction and writes DESIGN-BRIEF.md |
| /uiux | Redesign any screen, pixel-perfect, recursive |
| /uicolor | Color correction: balance, temperature, shadows, hierarchy, 60-30-10 |
| /animate | Add or fix animations and micro-interactions |
| /copy | Audit and rewrite all user-facing strings |
| /a11y | Fix accessibility violations (WCAG 2.1 AA) |
| /tokens | Find hardcoded design values and replace with tokens |
| /landing | Optimise a marketing or product landing page for conversion |
