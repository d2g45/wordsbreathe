import { test, expect, type Page } from "@playwright/test";

// Live entries in the local database, plus the dev-only fixture page.
// Update the list when pages are added or removed.
const PAGES = [
  "/",
  "/what-we-do",
  "/what-we-do/counselling",
  "/what-we-do/helpful-resources",
  "/what-we-do/workshops",
  "/who-we-are",
  "/workshops/grit-the-roots-of-gratitude",
  "/workshops/navigating-values",
  "/test/components",
];

// Opens a page and fails on any uncaught error, which is how a component
// that can't be constructed shows up (#10). `goto` waits for `load`. By then
// main.ts, a module script, has run, and App.init has run on DOMContentLoaded.
const openPage = async (page: Page, path: string): Promise<void> => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(path);

  expect(await page.evaluate(() => "App" in window), "main.ts never ran").toBe(true);
  expect(errors).toEqual([]);
};

for (const path of PAGES) {
  test(`${path} starts its scripts without errors`, async ({ page }) => {
    await openPage(page, path);
  });
}

test("every registered component has a test", async ({ page }) => {
  await openPage(page, "/test/components");

  // Adding a component to main.ts fails this until it has a test in this file.
  const selectors = await page.evaluate(() =>
    window.App.components.map((component) => component.selector),
  );
  expect(selectors).toEqual([".js-modal", ".js-tabs", ".js-gallery", ".js-form-modal"]);
});

test("tabs switch the content and background", async ({ page }) => {
  await openPage(page, "/what-we-do");

  const buttons = page.locator(".js-tabs-button");
  await expect(buttons.nth(1)).toBeAttached();

  const firstId = await buttons.first().getAttribute("data-id");
  const lastId = await buttons.last().getAttribute("data-id");
  await buttons.last().click();

  await expect(page.locator(`#tab-content-${lastId}`)).toContainClass("tab-content--active");
  await expect(page.locator(`#tab-content-${firstId}`)).not.toContainClass("tab-content--active");

  // A tab without an image renders no background element.
  const background = page.locator(`#tab-background-${lastId}`);
  if ((await background.count()) > 0) {
    await expect(background).toContainClass("tab-background--active");
  } else {
    test.info().annotations.push({
      type: "note",
      description: "The last tab has no image, so the background wasn't checked.",
    });
  }
});

test("the gallery mounts and moves to the next slide", async ({ page }) => {
  await openPage(page, "/workshops/navigating-values");

  const gallery = page.locator(".js-gallery");
  await expect(gallery).toContainClass("glide--slider");

  const slides = gallery.locator(".glide__slide");
  await expect(slides.nth(1)).toBeAttached();
  await expect(slides.first()).toContainClass("glide__slide--active");

  await gallery.locator(".glide__arrow--right").click();
  await expect(slides.nth(1)).toContainClass("glide__slide--active");
});

test("the modal opens, and closes by button, overlay and Escape", async ({ page }) => {
  await openPage(page, "/test/components");

  const modal = page.locator(".js-modal");
  const open = page.getByRole("button", { name: "Open test modal" });
  await expect(modal).toBeHidden();

  await open.click();
  await expect(modal).toBeVisible();
  await modal.locator(".js-close").click();
  await expect(modal).toBeHidden();

  // The panel covers the overlay's centre, and the fixed header covers its top,
  // because <main> is its own stacking context (_layout.twig). So click the
  // bottom-left corner.
  await open.click();
  const overlay = modal.locator(".js-modal-overlay");
  const box = await overlay.boundingBox();
  if (!box) throw new Error("The modal overlay has no box");
  await overlay.click({ position: { x: 5, y: box.height - 5 } });
  await expect(modal).toBeHidden();

  await open.click();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});
