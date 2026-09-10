import { expect, test } from "@playwright/test";
import { SCOPE_REPLY } from "../src/lib/chat/types";

// Exercise the running Next.js route, including its real Request URL and Host.
// These obvious out-of-scope questions are refused before loading any provider.
test("the real browser can ask the assistant through the same-origin Next route", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Open Khanh/ }).click();
  await page
    .getByRole("textbox", { name: /Your question/ })
    .fill("What is the capital of France?");
  const response = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/chat") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(page.locator(".clone-chat-message-assistant")).toHaveText(
    `Khanh’s Clone${SCOPE_REPLY}`,
  );
  await expect(page.locator(".clone-chat").getByRole("alert")).toHaveCount(0);
});

test("the running Next route rejects a cross-origin JSON request", async ({
  request,
  baseURL,
}) => {
  const response = await request.post(`${baseURL}/api/chat`, {
    headers: { Origin: "https://another-site.example" },
    data: {
      messages: [{ role: "user", content: "What is the capital of France?" }],
    },
  });
  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({
    error: "Open the assistant from this portfolio to send a question.",
  });
});
