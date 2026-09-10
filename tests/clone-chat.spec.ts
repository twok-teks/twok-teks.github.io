import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// These checks mock /api/chat. They verify the interface, not the Groq service.
type Turn = { role: "user" | "assistant"; content: string };
const question = (page: Page) =>
  page.getByRole("textbox", { name: /Your question for Khanh/ });
const dialog = (page: Page) => page.getByRole("dialog", { name: /Khanh/ });
const log = (page: Page) =>
  page.getByRole("region", { name: "Chat conversation" });
const assistantMessages = (page: Page) =>
  page.locator(".clone-chat-message-assistant");
const userMessages = (page: Page) => page.locator(".clone-chat-message-user");

async function openChat(page: Page) {
  await page.getByRole("button", { name: /Open Khanh/ }).click();
  await expect(dialog(page)).toBeVisible();
  await expect(question(page)).toBeFocused();
}

async function send(page: Page, content: string) {
  await question(page).fill(content);
  await question(page).press("Enter");
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const longReply = Array.from(
  { length: 42 },
  (_, index) =>
    `Project note ${index + 1}: software, thoughtful decisions, and the evidence behind the work.`,
).join("\n\n");

test("launcher opens a nonmodal guide and the site remains navigable", async ({
  page,
}) => {
  await page.goto("/");
  await openChat(page);
  await expect(dialog(page)).toHaveAttribute("aria-modal", "false");
  for (const suggestion of [
    "What does Khanh build?",
    "Tell me about GitGuide",
    "What is his AI experience?",
  ]) {
    await expect(
      dialog(page).getByRole("button", { name: suggestion }),
    ).toBeVisible();
  }
  await question(page).fill("An unfinished question");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await navigation.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(dialog(page)).toBeVisible();
  await expect(question(page)).toHaveValue("An unfinished question");
  await expect(question(page)).not.toBeFocused();
  await navigation.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(dialog(page)).toBeVisible();
});

test("suggestions send real request payloads and followups include the full conversation", async ({
  page,
}) => {
  const requests: Turn[][] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON().messages);
    await route.fulfill({
      json: {
        reply:
          requests.length === 1
            ? "Explore [the projects](/projects) for the work."
            : "Here is the follow-up.",
        sources: [{ label: "Project index", url: "/projects" }],
      },
    });
  });
  await page.goto("/");
  await openChat(page);
  await dialog(page)
    .getByRole("button", { name: "What does Khanh build?" })
    .click();
  await expect(assistantMessages(page)).toHaveCount(1);
  await send(page, "Which decisions mattered?");
  await expect(assistantMessages(page)).toHaveCount(2);
  expect(requests).toEqual([
    [{ role: "user", content: "What does Khanh build?" }],
    [
      { role: "user", content: "What does Khanh build?" },
      {
        role: "assistant",
        content: "Explore [the projects](/projects) for the work.",
      },
      { role: "user", content: "Which decisions mattered?" },
    ],
  ]);
  await assistantMessages(page)
    .first()
    .getByRole("link", { name: "the projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(dialog(page)).toBeVisible();
  await expect(assistantMessages(page)).toHaveCount(2);
});

test("minimize, route navigation, and reload retain the draft, transcript, and scroll position", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ json: { reply: longReply } }),
  );
  await page.goto("/");
  await openChat(page);
  await send(page, "Tell me more about the work.");
  await expect(assistantMessages(page)).toHaveCount(1);
  await question(page).fill("Keep this draft for later");
  await log(page).evaluate((element) => {
    element.scrollTop = 75;
  });
  await expect
    .poll(() => log(page).evaluate((element) => element.scrollTop))
    .toBe(75);
  await dialog(page)
    .getByRole("button", { name: /Close Khanh/ })
    .click();
  await expect(dialog(page)).toBeHidden();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await openChat(page);
  await expect(question(page)).toHaveValue("Keep this draft for later");
  await expect(assistantMessages(page)).toContainText("Project note 42");
  await expect
    .poll(() => log(page).evaluate((element) => element.scrollTop))
    .toBe(75);
  await page.reload();
  await expect(dialog(page)).toBeVisible();
  await expect(question(page)).toHaveValue("Keep this draft for later");
  await expect(assistantMessages(page)).toContainText("Project note 42");
  await expect
    .poll(() => log(page).evaluate((element) => element.scrollTop))
    .toBe(75);
  await expect(
    page.getByRole("log", { name: /New replies/ }).locator("p"),
  ).toHaveCount(0);
});

test("an arriving reply does not scroll away from older messages", async ({
  page,
}) => {
  const reply = deferred();
  let requestCount = 0;
  await page.route("**/api/chat", async (route) => {
    requestCount += 1;
    if (requestCount === 2) await reply.promise;
    await route.fulfill({
      json: {
        reply: requestCount === 1 ? longReply : "The follow-up is ready.",
      },
    });
  });
  await page.goto("/");
  await openChat(page);
  await send(page, "Give me a detailed overview.");
  await expect(assistantMessages(page)).toHaveCount(1);
  await send(page, "Tell me more.");
  await expect(
    page.getByRole("status").filter({ hasText: /Looking through Khanh/ }),
  ).toBeVisible();
  await log(page).evaluate((element) => {
    element.scrollTop = 90;
  });
  await expect
    .poll(() => log(page).evaluate((element) => element.scrollTop))
    .toBe(90);
  reply.resolve();
  await expect(assistantMessages(page)).toHaveCount(2);
  await expect
    .poll(() => log(page).evaluate((element) => element.scrollTop))
    .toBe(90);
  await dialog(page).getByRole("button", { name: "New reply" }).click();
  await expect
    .poll(() =>
      log(page).evaluate(
        (element) =>
          element.scrollHeight - element.clientHeight - element.scrollTop,
      ),
    )
    .toBeLessThanOrEqual(1);
});

test("New session clears saved conversation and rejects an old in-flight response", async ({
  page,
}) => {
  const release = deferred();
  const finished = deferred();
  const requests: Turn[][] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON().messages);
    if (requests.length === 1) {
      await release.promise;
      try {
        await route.fulfill({
          json: { reply: "A stale reply from the old session." },
        });
      } finally {
        finished.resolve();
      }
    } else {
      await route.fulfill({ json: { reply: "A reply for the new session." } });
    }
  });
  await page.goto("/");
  await openChat(page);
  await send(page, "An old question");
  await expect.poll(() => requests.length).toBe(1);
  await dialog(page)
    .getByRole("button", { name: "New session", exact: true })
    .click();
  await expect(userMessages(page)).toHaveCount(0);
  await expect(question(page)).toHaveValue("");
  release.resolve();
  await finished.promise;
  await send(page, "A new question");
  await expect(assistantMessages(page)).toHaveCount(1);
  await expect(assistantMessages(page)).toContainText(
    "A reply for the new session.",
  );
  await expect(dialog(page)).not.toContainText("stale reply");
  expect(requests[1]).toEqual([{ role: "user", content: "A new question" }]);
  await dialog(page)
    .getByRole("button", { name: "New session", exact: true })
    .click();
  await page.reload();
  await expect(dialog(page)).toBeVisible();
  await expect(userMessages(page)).toHaveCount(0);
  await expect(assistantMessages(page)).toHaveCount(0);
  await expect(question(page)).toHaveValue("");
});

test("submitted drafts clear immediately, failures preserve history, and retry does not duplicate a question", async ({
  page,
}) => {
  const requests: Turn[][] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON().messages);
    await route.fulfill(
      requests.length === 2
        ? {
            status: 503,
            json: {
              error: "The chat is temporarily unavailable. Please try again.",
            },
          }
        : {
            json: {
              reply:
                requests.length === 1
                  ? "The first answer is saved."
                  : "The retried reply is ready.",
            },
          },
    );
  });
  await page.goto("/");
  await openChat(page);
  await send(page, "The first question");
  await expect(assistantMessages(page)).toHaveCount(1);
  await send(page, "The follow-up question");
  await expect(dialog(page).getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(question(page)).toHaveValue("");
  await expect(userMessages(page)).toHaveCount(2);
  await question(page).fill("An edited draft for later");
  await dialog(page).getByRole("button", { name: "Retry reply" }).click();
  await expect(assistantMessages(page)).toHaveCount(2);
  await expect(userMessages(page)).toHaveCount(2);
  await expect(question(page)).toHaveValue("An edited draft for later");
  expect(requests[2]).toEqual(requests[1]);
  await expect(assistantMessages(page).first()).toContainText(
    "The first answer is saved.",
  );
});

test("chat works in memory when browser storage is blocked", async ({
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
  await page.route("**/api/chat", (route) =>
    route.fulfill({ json: { reply: "The interface still works." } }),
  );
  await page.goto("/");
  await openChat(page);
  await send(page, "Can I ask about the work?");
  await expect(assistantMessages(page)).toHaveCount(1);
  await question(page).fill("A draft without storage");
  await dialog(page)
    .getByRole("button", { name: /Close Khanh/ })
    .click();
  await openChat(page);
  await expect(question(page)).toHaveValue("A draft without storage");
  await expect(assistantMessages(page)).toContainText(
    "The interface still works.",
  );
});

test("Escape minimizes the chat and returns focus to the launcher", async ({
  page,
}) => {
  await page.goto("/");
  await openChat(page);
  await question(page).fill("Keep this when I close the panel");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  const launcher = page.getByRole("button", { name: /Open Khanh/ });
  await expect(launcher).toBeFocused();
  await expect(launcher).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(question(page)).toBeFocused();
  await expect(question(page)).toHaveValue("Keep this when I close the panel");
});

for (const fontSize of ["100%", "200%"]) {
  test(`mobile chat fits at 375px with ${fontSize} text`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.evaluate((size) => {
      document.documentElement.style.fontSize = size;
    }, fontSize);
    await openChat(page);
    const dimensions = await dialog(page).evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
        viewport: document.documentElement.clientWidth,
        width: document.documentElement.scrollWidth,
      };
    });
    expect(dimensions.left).toBeGreaterThanOrEqual(11);
    expect(dimensions.right).toBeLessThanOrEqual(364);
    expect(dimensions.top).toBeGreaterThanOrEqual(64);
    expect(dimensions.bottom).toBeLessThan(812);
    expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport + 1);
    const sendBounds = await dialog(page)
      .getByRole("button", { name: "Send message" })
      .boundingBox();
    expect(sendBounds!.y + sendBounds!.height).toBeLessThanOrEqual(
      dimensions.bottom,
    );
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    await expect(dialog(page)).toBeVisible();
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`open chat is accessible in ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await openChat(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("assistant answers render as readable summaries and labeled bullets", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      json: {
        reply:
          "Khanh combines production AI engineering with academic research.\n\n**Industry:** He built RAG tooling and led an AI collision-reconstruction project.\n**Research:** He benchmarked four LLMs and trained a response-level detector.",
        sources: [{ label: "AI experience", url: "/experience" }],
      },
    }),
  );
  await page.goto("/");
  await openChat(page);
  await send(page, "What is his AI experience?");

  const answer = assistantMessages(page).first();
  await expect(question(page)).toHaveValue("");
  await expect(answer.locator(".clone-chat-rich-text > p").first()).toHaveText(
    "Khanh combines production AI engineering with academic research.",
  );
  await expect(answer.locator(".clone-chat-rich-text li")).toHaveCount(2);
  await expect(answer.locator("strong").first()).toHaveText("Industry:");
  await expect(answer.locator("strong").last()).toHaveText("Research:");
});
test("message links allow internal and HTTPS destinations and escape unsafe content", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      json: {
        reply:
          "Read [projects](/projects) and [GitHub](https://github.com/). Ignore [unsafe](javascript:alert(1)) and <img src=x onerror=alert(1)>.",
        sources: [
          { label: "Project index", url: "/projects" },
          { label: "Unsafe source", url: "javascript:alert(1)" },
        ],
      },
    }),
  );
  await page.goto("/");
  await openChat(page);
  await send(page, "Where can I read more?");
  await expect(assistantMessages(page)).toHaveCount(1);
  await expect(
    assistantMessages(page).getByRole("link", {
      name: "projects",
      exact: true,
    }),
  ).toHaveAttribute("href", "/projects");
  await expect(
    assistantMessages(page).getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", "https://github.com/");
  await expect(
    assistantMessages(page).getByRole("link", { name: /unsafe/i }),
  ).toHaveCount(0);
  await expect(assistantMessages(page).locator("img")).toHaveCount(0);
  await expect(assistantMessages(page)).toContainText(
    "<img src=x onerror=alert(1)>",
  );
});
