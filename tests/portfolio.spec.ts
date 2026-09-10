import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/projects",
  "/experience",
  "/about",
  "/projects/git-guide",
  "/projects/fall-foliage",
  "/projects/llm-hallucination-analysis",
];
const widths = [375, 390, 768, 1024, 1280, 1440];

async function expectNoHorizontalOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("body *")]
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          style.position !== "fixed" &&
          style.visibility !== "hidden" &&
          bounds.width > 0 &&
          bounds.right > document.documentElement.clientWidth + 1
        );
      })
      .slice(0, 8)
      .map((element) => `${element.tagName}.${element.className}`),
  }));
  expect(
    dimensions.content,
    `${page.url()}: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const width of widths) {
  test(`all key routes fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
    }
  });
}

for (const width of [375, 768, 1280]) {
  test(`200% text size stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("button", { name: /^Theme:/ })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
}

test("primary links navigate to their routes and mark the active page", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  for (const [label, route] of [
    ["Projects", "/projects"],
    ["Experience", "/experience"],
    ["About", "/about"],
  ]) {
    const link = navigation.getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.getByRole("banner").getByRole("link", { name: /home/i }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("project links open the published case studies and verified destinations", async ({
  page,
}) => {
  const projects = [
    {
      slug: "git-guide",
      title: "GitGuide",
      source: "https://github.com/twok-teks/git-guide",
    },
    {
      slug: "fall-foliage",
      title: "Fall Foliage",
      source: "https://github.com/twok-teks/Fall_Foliage_ML_Model",
    },
    {
      slug: "llm-hallucination-analysis",
      title: "When LLMs get it wrong",
      source: "https://github.com/twok-teks/llm-hallucination-analysis",
    },
  ];

  for (const project of projects) {
    await page.goto("/projects");
    await page
      .locator(`main a[href="/projects/${project.slug}"]`)
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
    await expect(
      page.getByRole("main").getByRole("heading", { level: 2 }),
    ).not.toHaveCount(0);
    await expect(page.getByRole("main")).not.toContainText(
      /content placeholder|content preview/i,
    );

    if (project.source) {
      await expect(
        page.getByRole("link", { name: /^View source/ }),
      ).toHaveAttribute("href", project.source);
    }
    if (project.slug === "git-guide") {
      await expect(
        page.getByRole("link", { name: /^Try the project/ }),
      ).toHaveAttribute("href", "https://git-guide-sand.vercel.app");
    }
    if (project.slug === "fall-foliage") {
      await expect(
        page.getByRole("link", { name: /^Try the project/ }),
      ).toHaveCount(0);
    }
  }
});

test("resume and research records link to real PDF documents", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("banner").locator('a[href="/resume.pdf"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: /^Read paper/ }),
  ).toHaveAttribute("href", "/research/hallucination-analysis.pdf");

  for (const documentPath of [
    "/resume.pdf",
    "/research/hallucination-analysis.pdf",
  ]) {
    const response = await request.get(documentPath);
    expect(response.ok(), documentPath).toBeTruthy();
    expect(response.headers()["content-type"], documentPath).toMatch(
      /^application\/pdf(?:;|$)/i,
    );
    const body = await response.body();
    expect(body.subarray(0, 5).toString("ascii"), documentPath).toBe("%PDF-");
  }

  await page.goto("/experience");
  const research = page.getByRole("region", {
    name: "Questions worth testing.",
    exact: true,
  });
  const austin = research.locator("details").filter({
    hasText: "Hallucination Analysis in LLMs",
  });
  await expect(austin).toContainText("The University of Texas at Austin");
  await expect(austin).toContainText("Jan 2026 – May 2026");
  await expect(
    austin.getByRole("link", { name: "Read report", exact: true }),
  ).toHaveAttribute("href", "/research/hallucination-analysis.pdf");
  await expect(
    austin.getByRole("link", { name: "Study overview", exact: true }),
  ).toHaveAttribute("href", "/projects/llm-hallucination-analysis");

  const dallas = research.locator("details").filter({
    hasText: "Research Associate",
  });
  await expect(dallas).toContainText("The University of Texas at Dallas");
  await expect(dallas).toContainText("Oct 2024 – May 2025");
  await expect(dallas).toContainText("multimodal meme data");
});

test("project filters show only categories that contain real work", async ({
  page,
}) => {
  await page.goto("/projects");
  const collection = page.getByRole("region", { name: "Project collection" });
  const filters = collection.getByRole("group", { name: "Filter projects" });
  const status = collection.getByRole("status");

  await expect(filters.getByRole("button")).toHaveCount(4);
  for (const [label, slug] of [
    ["AI product", "git-guide"],
    ["Applied ML", "fall-foliage"],
    ["Research", "llm-hallucination-analysis"],
  ] as const) {
    const filter = filters.getByRole("button", {
      name: new RegExp(`^${label}`),
    });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(status).toHaveText("1 project shown");
    await expect(
      collection.locator(`a[href="/projects/${slug}"]`).first(),
    ).toBeVisible();
  }

  await filters.getByRole("button", { name: /^All work/ }).click();
  await expect(status).toHaveText("3 projects shown");
  await expect(
    collection.locator('a[href="/projects/portfolio-system"]'),
  ).toHaveCount(0);
});

test("project image and paper galleries move with labeled controls", async ({
  page,
}) => {
  await page.goto("/projects");
  const gitGuide = page.getByLabel("GitGuide media gallery");
  await expect(gitGuide.getByAltText(/GitGuide home page/i)).toBeVisible();
  await gitGuide.getByRole("button", { name: "Next image" }).click();
  await expect(gitGuide.getByAltText(/learning roadmap/i)).toBeVisible();
  await expect(gitGuide).toContainText("IMAGE 02 / 06");

  const paper = page.getByLabel("When LLMs get it wrong media gallery");
  await expect(paper.locator(".project-pdf-page")).toHaveAttribute(
    "data-status",
    "ready",
  );
  await expect(paper.getByRole("img", { name: /page 1$/i })).toBeVisible();
  await paper.getByRole("button", { name: "Next page" }).click();
  await expect(paper.locator(".project-pdf-page")).toHaveAttribute(
    "data-status",
    "ready",
  );
  await expect(paper.getByRole("img", { name: /page 2$/i })).toBeVisible();
  await expect(paper).toContainText("PAGE 02 / 26");

  await page.goto("/projects/fall-foliage");
  const detailGallery = page.getByLabel("Fall Foliage media gallery");
  await detailGallery.getByRole("button", { name: "Next image" }).click();
  await expect(
    detailGallery.getByAltText(/displaying predicted seasonal/i),
  ).toBeVisible();
});

test("About tabs and Experience disclosures work from the keyboard", async ({
  page,
}) => {
  await page.goto("/about");
  const hobbies = page.getByRole("tab", { name: "Away from keys" });
  await hobbies.focus();
  await page.keyboard.press("Enter");
  await expect(hobbies).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Swimming");

  const midnight = page.getByRole("tab", { name: "12:47 a.m." });
  await midnight.click();
  await expect(page.getByRole("tabpanel")).toContainText("imposter syndrome");

  await page.goto("/experience");
  const firstRole = page.locator("details.career-card").first();
  const summary = firstRole.locator("summary");
  await expect(firstRole).toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(firstRole).not.toHaveAttribute("open");
  await page.keyboard.press("Enter");
  await expect(firstRole).toHaveAttribute("open", "");
});
test("skip link moves keyboard focus past navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("mobile navigation supports keyboard dismissal and closes after navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /open navigation/i });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobile).toBeVisible();
  await expect(
    page.getByRole("button", { name: /close navigation/i }),
  ).toHaveAttribute("aria-expanded", "true");
  await mobile.getByRole("link", { name: "Projects", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(mobile).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await mobile.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(mobile).toBeHidden();
});

test("theme follows the system and persists light, dark, and system choices", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const html = page.locator("html");
  const control = page.getByRole("button", { name: /^Theme:/ });
  await expect(html).toHaveAttribute("data-preference", "system");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html).toHaveAttribute("data-theme", "light");

  for (const preference of ["light", "dark", "system"]) {
    await control.click();
    await expect(html).toHaveAttribute("data-preference", preference);
    const resolved = preference === "system" ? "light" : preference;
    await expect(html).toHaveAttribute("data-theme", resolved);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      resolved === "dark" ? "#141517" : "#fafaf9",
    );
    await page.reload();
    await expect(html).toHaveAttribute("data-preference", preference);
    await expect(html).toHaveAttribute("data-theme", resolved);
  }
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("theme remains usable when browser storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage unavailable");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /^Theme:/ }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-preference",
    "light",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

for (const { route, theme } of [
  { route: "/", theme: "light" },
  { route: "/", theme: "dark" },
  { route: "/projects/git-guide", theme: "dark" },
  { route: "/projects/llm-hallucination-analysis", theme: "light" },
  { route: "/about", theme: "dark" },
] as const) {
  test(`accessible content on ${route} in ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("reduced motion disables smooth scrolling and long transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    durations: [...document.querySelectorAll("a, button")].flatMap(
      (element) => {
        const style = getComputedStyle(element);
        return [style.transitionDuration, style.animationDuration].flatMap(
          (value) => value.split(",").map((duration) => parseFloat(duration)),
        );
      },
    ),
  }));
  expect(motion.scroll).toBe("auto");
  expect(Math.max(...motion.durations)).toBeLessThanOrEqual(0.001);
});

test("published routes expose real identity, canonical metadata, and an indexable sitemap", async ({
  page,
  request,
}) => {
  const publicOrigin = "https://twok-teks.space";
  for (const route of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(/Khanh Van/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{20,}/,
    );
    await expect
      .poll(async () => {
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute("href");
        return canonical ? new URL(canonical).href : null;
      })
      .toBe(new URL(route, publicOrigin).href);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /^index,\s*follow$/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.getByRole("main")).not.toContainText(
      /content placeholder|content preview|Your name|Your applied AI project|Your systems project/i,
    );
  }

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const directives = await robots.text();
  expect(directives).toMatch(/Allow:\s*\/(?:\r?\n|$)/i);
  expect(directives).not.toMatch(/Disallow:\s*\/(?:\r?\n|$)/i);
  expect(directives).toContain(`Sitemap: ${publicOrigin}/sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapXml = await sitemap.text();
  const urls = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    return [...document.querySelectorAll("loc")].map(
      (location) => new URL(location.textContent || "").href,
    );
  }, sitemapXml);
  expect(urls).toEqual(
    expect.arrayContaining(
      routes.map((route) => new URL(route, publicOrigin).href),
    ),
  );
  expect(
    urls.every((url) => new URL(url).origin === publicOrigin),
  ).toBeTruthy();
  expect(sitemapXml).not.toMatch(/applied-ai-project|systems-project/);

  await page.goto("/");
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(structuredData.map((text) => JSON.parse(text))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "@type": "Person",
        name: "Khanh Van",
        url: publicOrigin,
      }),
    ]),
  );
});

test("unknown routes and project slugs return a helpful 404", async ({
  page,
}) => {
  for (const route of [
    "/does-not-exist",
    "/projects/does-not-exist",
    "/projects/applied-ai-project",
    "/projects/systems-project",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.locator('main a[href="/projects"]').click();
    await expect(page).toHaveURL(/\/projects$/);
  }
});
