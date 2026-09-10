# Portfolio design system

## Repository audit

The supplied workspace was empty on 2026-09-07. There was no previous design document, application, verified biography, resume, project content, or imagery. This is a greenfield implementation using Next.js App Router, React, TypeScript, and plain CSS. Do not infer identity, employers, degrees, publications, achievements, or personal interests from examples in the brief.

## Direction

A technical editorial portfolio with the care of a small software product. Calm, precise, human, and work-first. Typography, alignment, whitespace, and separators provide hierarchy. Cards are reserved for project media and interactive modules. Never use decorative floating objects, animated backgrounds, stock AI imagery, fabricated product screenshots, skill ratings, or a full-screen hero.

## Information architecture

Routes: `/`, `/projects`, `/projects/[slug]`, `/experience`, `/about`. The home sequence is hero, selected work, additional projects, experience, short story, publications (when supplied), and education (when supplied). Main navigation has Projects, Experience, About; the wordmark returns Home. Resume and theme are utility actions. Missing resume information is clearly unavailable, never linked to a fabricated destination.

## Content integrity

Typed content lives in `src/content`. Verified content now comes from the owner-supplied resume and April 2026 research report, public GitHub source, and the existing personal site. Unfilled project examples must be explicitly marked as content placeholders, never presented as accomplishments or included in published structured data. Empty career and personal content has intentional preview states. Missing identity/domain keep search indexing disabled. All future metrics and confidential material require a public source supplied by the owner.

## Tokens and typography

- Font: locally hosted Inter variable; monospace system font only for tiny indexes and metadata.
- Light: paper `#fafaf9`, text `#191b20`, muted `#62656e`, border `#dedfdf`, surface `#f1f2f1`, blue `#2855d9`.
- Dark: paper `#141517`, text `#edeef0`, muted `#a1a4ad`, border `#32343a`, surface `#1c1e22`, daisy yellow `#ffea60`.
- Body 16px, line height 1.65; prose 17–18px; metadata 11–13px; section titles 30–40px; fluid hero 42–68px with slightly tight tracking.
- Main container 1160px; reading column 720px. Gutters 20px mobile, 32px tablet, 40px desktop.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 104px.
- Radius 6px controls, 10px media; no resting drop shadows on content.

## Surfaces and technical paper

Use a stationary 40px grid only in the hero and project-media areas. Lines have very low neutral opacity and a radial fade. Tune light and dark independently. Prose stays on quiet paper. Tiny index marks and crosshairs may establish structure; each should support orientation. Blue is used for links, selected states, focus, and small accents in light mode; the daisy yellow fills the same role in dark mode.

## Layout and project hierarchy

Navigation is 64px and sticky with a fine bottom border. Hero stays compact enough for selected work to begin within a laptop's initial viewport. Featured work has a wide media area and a concise project story: problem, contribution, evidence, technologies, and real links. Use at most three featured projects and 3–5 preview technologies. Additional work, employment, education, and bibliography use rows, not repeated cards. Case-study prose is narrower than media and includes context, role, constraints, solution, decisions, tradeoffs, results, and learnings only when supported by content.

## Responsive behavior

Validate 375, 390, 768, 1024, 1280, and 1440px. Project columns stack without reordering meaning. Mobile navigation uses an explicit menu with Escape/route close and native focus behavior. Minimum practical target size is 44px. Text, URLs, and tags wrap. At 200% zoom, content and actions remain available without horizontal page overflow.

## Interaction, accessibility, and theme

Use native links/buttons/details, semantic landmarks, one h1 per route, sequential headings, a visible-on-focus skip link, and a 2px focus ring with offset. Information is never hover-only. Use accessible text contrast and text alongside status colors. Transitions are 150–220ms; arrows may move 3px. No perpetual motion or scaling cards. Reduced motion disables smooth scrolling and transitions. Theme starts from system preference, supports persisted light/dark/system selection, responds to system changes, and sets color-scheme/theme-color before paint. Storage failures must not break interaction.

## Media and performance

Server components and static routes by default; client code only for theme, mobile navigation, and meaningful small interactions. CSS/SVG diagrams describe actual implementation or carry an explicit illustrative label. Support responsive images with dimensions, opt-in video with controls, code, and captions. No autoplay, invented screenshots, heavy animation dependency, or remotely loaded runtime font. Reserve media aspect ratios to prevent layout shifts.

## Metadata and validation

Each route has a title and description; each real project has a share preview. Configure canonical URL, sitemap, robots, and Person structured data only with a real owner/domain. Add a favicon and social preview. Run formatting, lint, TypeScript, production build, and meaningful browser checks for navigation, themes, keyboard, reduced motion, missing routes, responsive overflow, and accessibility. Record any remaining content prerequisites in README.

## Khanh’s Clone

The persistent assistant is mounted once in the root layout. A circular robot control opens a nonmodal panel at the lower right, matching the site themes. It must leave the page usable, preserve conversation/draft/scroll across route changes and minimization, and reset only through New session within a tab. Source-grounded answers stay limited to Khanh’s documented work and background. Groq credentials stay server-side. Use concise answers, verified source links, explicit pending/error states, keyboard controls, and a readable mobile layout.
