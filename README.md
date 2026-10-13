# Khanh Van · twok-teks

A warm, editorial portfolio for software engineering and applied AI, built with Next.js App Router, TypeScript, and plain CSS. The site includes GitGuide, Fall Foliage, an LLM hallucination study, experience, education, and Khanh’s Clone.

## Run locally

Use Node.js 20.9+ and npm (in PowerShell with restricted script execution, use `npm.cmd` and `npx.cmd`):

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Connect Khanh’s Clone

Copy `.env.example` to `.env.local` and replace its placeholder with your real Groq key:

```dotenv
NEXT_PUBLIC_SITE_URL=https://twok-teks.space
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Restart the server after changing these values. On a deployed host, set the same environment variables in the host’s settings and redeploy. `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-120b` when unset or blank. If an existing deployment still sets `GROQ_MODEL=groq/compound-mini`, update or remove that override so it uses the new model. The key stays on the server; never prefix it with `NEXT_PUBLIC_`.

Without a real key, the assistant shows a connection message rather than inventing an answer. Automated tests mock Groq; they do not establish live-provider answer quality. The integration uses [Groq Chat Completions](https://console.groq.com/docs/api-reference) and [OpenAI GPT-OSS 120B hosted by Groq](https://console.groq.com/docs/model/openai/gpt-oss-120b), with the same `GROQ_API_KEY`.

GPT-OSS requests use JSON object mode, low reasoning effort, and a 4,096-token completion budget to leave room for reasoning and the final answer. [Reasoning is excluded from the response](https://console.groq.com/docs/reasoning) with `include_reasoning: false`; tools remain disabled. Other configured chat models retain the generic request settings without GPT-OSS-specific reasoning parameters.

The circular robot button opens a nonmodal panel. Visitors can continue using the site while it is open. The panel, draft, scroll position, and full conversation persist across routes, minimization, and reloads in the same tab using `sessionStorage`. **New session** clears them and cancels any pending reply. A new browser tab starts its own session. If storage is unavailable, memory persists for the current page lifetime.

## Content and source material

The supplied résumé is available at `public/resume.pdf`; the research report at `public/research/hallucination-analysis.pdf`. Professional facts follow the résumé. Research numbers and limitations follow the April 2026 report, which is a demonstration study, not a claim of universal hallucination detection. GitGuide and Fall Foliage details were checked against their public repositories. GitGuide is classified as applied AI because of its Git-panion assistant.

| File                            | Edit                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `src/content/site.ts`           | Name, nickname, role, public URLs, contact, canonical origin                       |
| `src/content/projects.ts`       | Project summaries, shorter preview outcomes, case studies, source/demo/paper links |
| `src/content/experience.ts`     | Roles, dates, outcomes, technologies                                               |
| `src/content/certifications.ts` | Verified earned credentials; empty until supplied                                  |
| `src/content/education.ts`      | Degrees, honors, expected/completed dates                                          |
| `src/content/publications.ts`   | Research report citation and links                                                 |
| `src/content/about.ts`          | Nickname story, interests, games, working principles                               |
| `src/lib/chat/context.ts`       | Assistant source assembly                                                          |
| `src/lib/chat/`                 | Reviewed source snapshots, provider integration, policy, request validation        |

Project content is centralized in `src/content/projects.ts`. Put screenshots in `public/projects/` and add them to a project's `media` array:

```ts
media: [
  {
    type: "image",
    src: "/projects/my-project/screenshot.png",
    alt: "Describe the actual screenshot.",
    width: 1600,
    height: 1000,
    caption: "What this view demonstrates.",
  },
],
```

The array also supports PDFs, captioned video, and code excerpts; see `ContentMedia` in `src/content/types.ts`. Overview cards use the first screenshot or a text cover. Interactive galleries appear on the detail pages. Missing demo URLs stay omitted.

No earned certifications appear in the supplied résumé or existing content. Add only verified earned credentials to `src/content/certifications.ts`; the Experience section stays hidden until then. Public-safe descriptions, role, status, and any available links/screenshots are still needed before adding separate case studies for the internal agent or “What Happened?” concept. No additional assets are required for the implemented redesign.

## Assistant behavior

The API uses only portfolio content, the supplied résumé/research facts, and reviewed public GitHub material. Source retrieval is restricted to known repositories; visitors cannot make it fetch arbitrary URLs. Repository text and conversation history are treated as untrusted data. Groq browsing and code tools are disabled.

Obvious unrelated tasks and instruction-extraction attempts are rejected before a provider call. The model must then return a scope decision, answer, and recognized source IDs. The server rejects malformed responses, unknown citations, generated URLs, HTML, and tool output. Valid source links are attached by the server. Unknown facts should receive an honest “not covered” response. These controls reduce misuse; model grounding still needs live evaluation after a key is configured.

The server validates the complete transcript and rejects oversized sessions with a request to start a new one; it never silently drops older turns. No chat database or server-side conversation logs are added. The current transcript and reference material are sent to Groq to generate each answer.

The API applies request and response size limits, a provider timeout, same-origin checks, and an instance-local rate limiter. For a public deployment with multiple instances, configure shared rate limiting at the host/edge and ensure forwarded IP headers are set by a trusted proxy.

## Design and metadata

[DESIGN.MD](./DESIGN.MD) records the visual system. Shared styles live in `src/app/globals.css`; chat styles live beside its component. An 860px column, ivory/espresso surfaces, forest/sage accents, bold local Inter headings, and italic serif accents keep the portfolio compact and personal. No dependencies were added

Home is a short introduction with recruiter-relevant facts, résumé download and an Experience link, and one personal line. Projects and Experience hold the detailed content; education and optional earned certifications live on Experience. `/about` permanently redirects to Home, with the sitemap and assistant links updated accordingly

The original daisy keeps the same colors in both themes. On Home it follows mouse movement and spins on click, tap, or keyboard activation. Touch disables pointer-following; reduced motion removes movement and animation. Project cards retain their subtle hover highlight, and routes fade in for 180ms without delaying navigation

The assistant shows a dismissible “Learn more about Khanh?” prompt after 1.4 seconds. It opens chat only when selected; dismissing it or opening chat suppresses the invitation for the tab. Themes still support system preferences and persisted manual selection without an initial flash

Metadata, sitemap, canonical URLs, Person structured data, favicon, and generated social previews use the verified identity and `https://twok-teks.space` by default. Override `NEXT_PUBLIC_SITE_URL` before building for a different public origin. This workspace does not deploy or replace the existing public site automatically.

## Checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test:e2e -- --workers=3
```

Build before the browser suite. Playwright uses installed Edge on Windows; otherwise run `npx playwright install chromium`. Tests cover responsive pages, keyboard navigation, themes, zoom, metadata, PDFs, chat session behavior, and the API’s validation/grounding boundaries with mocked provider responses.
