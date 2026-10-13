# Portfolio design system

## Direction

A compact, personal introduction with warm paper, strong typography, and a playful daisy. Retain the existing Next.js App Router, TypeScript, plain CSS, local Inter font, verified content, and assistant. No new dependencies.

## Visual identity

| Token           | Light   | Dark    |
| --------------- | ------- | ------- |
| Paper           | #f7f5ef | #20221f |
| Surface         | #eeece4 | #292c26 |
| Ink             | #292b26 | #f0eee5 |
| Secondary text  | #68695e | #b1b2a5 |
| Forest / sage   | #53664e | #b2c5a4 |
| Walnut / copper | #84694f | #c3a687 |
| Border          | #deddd2 | #3e4237 |

Use an 860px maximum column, 20px phone gutters, and generous spacing. Locally hosted Inter provides bold headings (720–780 weight) and readable body copy. Contrast selected phrases with italic system serif lettering. Avoid decorative periods in headings, short descriptions, and résumé bullets. Preserve punctuation needed by technical explanations and abbreviations.

Always render the original daisy asset in both themes, without inversion, grayscale, tinting, or other image filters. Its white petals and yellow center are part of the identity.

## Information architecture

- Home: a short introduction with name, current role, graduate study, résumé download and an Experience link, and one off-screen line
- Projects: responsive two-column collection, category filters, and links to complete case studies
- Experience: professional roles, research, education, and earned certifications if supplied
- Project details: source/demo/report links, screenshot or PDF galleries, technical narrative, limitations, and results
- Former About links permanently redirect to Home; the sitemap and chat source links point to Home

Do not restore professional-experience lists, project cards, or education sections to the homepage. Longer personal notes remain in the centralized content for the assistant. Keep the visible homepage under roughly 75 words.

## Interactions

The latest direction allows a small playful interaction in addition to the existing project hover and route fades:

- The homepage daisy leans toward mouse movement and spins on click, tap, or keyboard activation
- Pointer updates use requestAnimationFrame only while events arrive; no idle loop, custom cursor, or particles
- Fine-pointer motion is disabled for touch/coarse devices and reduced-motion preferences
- Reduced motion removes the spin transition and all other animations
- Project cards retain their faint pointer highlight and single native link
- Page navigation uses a 180ms arrival fade without delaying navigation
- The assistant offers a “Learn more about Khanh?” invitation after 1.4 seconds, without opening chat or sending a request
- The invitation can open chat or be dismissed; dismissal persists for the tab and does not steal focus on appearance
- Chat conversation, draft, and scroll continue to persist across navigation

## Theme, accessibility, and media

Resolve system/manual theme before paint and persist preferences. Use semantic landmarks, one h1 per page, visible focus, a skip link, native controls, and keyboard-operable menus/disclosures. Preserve actual screenshots, research PDF, résumé, metadata, and canonical URLs.

Use static project previews on overview pages and interactive galleries inside case studies. Keep the research text cover so overview pages do not load the PDF renderer.

## Content integrity

Professional and project facts remain grounded in existing owner-supplied material. No earned credentials were found: certifications.ts stays empty until verified entries are supplied, and its Experience section stays hidden. Internal RAG work remains at the public résumé-summary level. Do not invent details, implementation status, screenshots, or credentials for internal work or the “What Happened?” concept.

## Verification

Run ESLint, TypeScript, production build, changed-file formatting, and Playwright. Cover 375–1440px widths, doubled text, theme persistence, unchanged daisy rendering, mouse/touch/keyboard interactions, reduced motion, invitation dismissal, redirects, galleries, chat persistence, and accessibility. Wait for arrival fades to settle before measuring contrast.
