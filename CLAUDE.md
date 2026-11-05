# portfolio

Linh Tran's portfolio: a static site (plain HTML/CSS) built from the Figma file "Portfolio". See `README.md`.

## UI skills

### Visual verification
Playwright is installed (devDependency) for screenshot and animation verification. Chromium is preinstalled at `/opt/pw-browsers` in the cloud container.
This is a static site. Serve it with `python3 -m http.server 8000` and use `http://localhost:8000`. **Skill scripts default to port 3000, so override the URL to port 8000.**
Run `npx playwright install chromium` if screenshots fail elsewhere.

### Accessibility scanning
axe-core is installed. /a11y uses it for programmatic WCAG 2.1 AA scanning. Known gaps found at setup: no skip-to-main link on `index.html` or the case studies (only in-page TOC "skip" links); `--fs-micro` is 10px.

### Token home
Design tokens live in `css/styles.css` (`:root`). Case-study stylesheets (`css/cs-*.css`) have their own `:root` blocks. /tokens reads and writes here.

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
