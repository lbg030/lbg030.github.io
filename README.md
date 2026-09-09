# Byeong Gwon Lee — Research portfolio

Static, accessible research portfolio for GitHub Pages. No framework, package
installation, or build service is required to serve the committed HTML.

## Edit and preview

```sh
node scripts/build.mjs
node scripts/build.mjs --check
node scripts/check.mjs
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Commit the generated pages together with source changes.

- `data/portfolio.mjs`: public profile, experience, education, publications, projects.
- `scripts/build.mjs`: shared semantic HTML templates for all five existing routes.
- `styles.css`: responsive layout, design tokens, focus and reduced-motion styles.
- `assets/js/site.js`: progressive navigation enhancement and demo selection.
- `assets/js/reconstruction.js`: on-demand Three.js scene and lifecycle management.
- `assets/vendor/three/`: locally hosted Three.js 0.180.0, including its MIT license.
- `assets/img/`: original research figures and optimized WebP display copies.

GitHub Pages can continue deploying from the repository root with its default
Jekyll build. `_config.yml` excludes working instructions, source data, scripts,
and verification output from the generated site. No external CDN is needed at
runtime. Existing `demo.html?v=mvsgs` and `demo.html?v=ijcai` routes are preserved.

## Content rules

Publications have explicit `Published` or `Under Review` status. Only published
papers appear in the Published / Accepted group. Submission venues do not imply
acceptance. The M2Depth public summary and authors follow its public arXiv record:
https://arxiv.org/abs/2608.20788. Private research material must never be added to
site content or assets. Use only approved high-level public descriptions.

The public CV at `cv/cv.pdf` is generated from the same career, education and
publication data as the website. After content changes, regenerate it with
`python scripts/build_cv.py` in a Python environment with `reportlab` installed.
The original CV is backed up locally under `output/pdf/cv-before-refresh.pdf`.
Original images, PDFs, and videos remain intact. Image links open the full PNG;
optimized WebP files are used within pages.

## Interaction and accessibility

The scene illustrates building surface samples, camera frustums and a trajectory;
it does not present experimental results. Density is keyboard adjustable. Rotation
starts only when requested; reduced motion disables rotation and parallax.
Rendering stops offscreen or in a hidden tab and otherwise runs only on changes.
The scene uses at most 7,600 particles, shared resources, a 1.5 pixel-ratio cap,
and resource disposal. WebGL initialization failure or context loss reveals a
static SVG, while all research information stays available as semantic HTML.

Without JavaScript, navigation, publications, projects, experience, education,
contact links and the reconstruction illustration remain available.

## Verification

`scripts/check.mjs` checks local asset links and anchors, unique IDs, headings,
image descriptions, required career facts, publication separation and accidental
private-content strings. `scripts/build.mjs --check` detects outdated HTML.
Browser verification uses Playwright CLI; screenshots are local under
`output/playwright/` and are excluded from version control and Pages output.
