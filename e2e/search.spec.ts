import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow, failOnConsoleErrors } from "./_helpers";

const box = () => "#rstse__search_bar_main_id";

test("search box follows the combobox pattern", async ({ page }) => {
  await page.goto("/");
  const input = page.locator(box());
  await expect(input).toHaveAttribute("role", "combobox");
  await expect(input).toHaveAttribute("aria-autocomplete", "list");
  await expect(input).toHaveAttribute("aria-expanded", "false");
});

test("returns results from the static index", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");
  await expect(page.getByRole("option").first()).toBeVisible();
});

test("result links resolve to real pages", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");

  const first = page.getByRole("option").first();
  await expect(first).toBeVisible();

  const href = await first.getAttribute("href");
  expect(href).toBeTruthy();

  // The link must actually go somewhere — this is the check that would have
  // caught Pagefind resolving URLs against its own bundle directory.
  const res = await page.request.get(href!);
  expect(res.status(), `result link ${href} should resolve`).toBeLessThan(400);
});

/**
 * Regression: `pagesToIgnore` was rebuilt every render and used as a memo
 * dependency, which reset the highlight to item 0 on every keystroke — arrow
 * navigation could not move at all.
 */
test("arrow keys move the highlight", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("the");

  const options = page.getByRole("option");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  const count = await options.count();
  test.skip(count < 2, "needs at least two results");

  await page.locator(box()).press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(options.first()).toHaveAttribute("aria-selected", "false");
});

test("aria-activedescendant tracks the highlight", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");

  const first = page.getByRole("option").first();
  await expect(first).toBeVisible();

  const id = await first.getAttribute("id");
  await expect(page.locator(box())).toHaveAttribute("aria-activedescendant", id!);
});

test("Enter opens the highlighted result", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");
  await expect(page.getByRole("option").first()).toBeVisible();

  await page.locator(box()).press("Enter");
  await expect(page).toHaveURL(/guides\//);
});

test("Escape closes the modal", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");
  await expect(page.locator(".rstse__portal--open")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.locator(".rstse__portal--open")).toBeHidden();
});

test("Cmd/Ctrl+K opens search", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "keyboard shortcut is desktop-only");
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  await expect(page.locator(".rstse__portal--open")).toBeVisible();
});

test("tells the visitor when nothing matched", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("zzzzzznotathing");
  await expect(page.getByText(/No result found/i)).toBeVisible();
});

test("no horizontal overflow with results open", async ({ page }) => {
  await page.goto("/");
  await page.locator(box()).fill("configuration");
  await expect(page.getByRole("option").first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("the demo page logs no errors", async ({ page }) => {
  const assertClean = failOnConsoleErrors(page);
  await page.goto("/");
  await page.locator(box()).fill("configuration");
  await page.waitForTimeout(600);
  assertClean();
});
