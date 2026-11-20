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

test("lazy images and backgrounds get their real source", async ({ page }) => {
  await openPage(page, "/");

  // images.ts copies data-src into src and into background-image. Both used to
  // run from a listener added while DOMContentLoaded was being dispatched, so
  // this is what breaks if App's start-up stops reaching them (#21).
  const unresolved = await page.evaluate(() => {
    const images = [...document.querySelectorAll<HTMLImageElement>(".js-image")];
    const backgrounds = [...document.querySelectorAll<HTMLElement>(".js-background-image")];

    return {
      counted: images.length + backgrounds.length,
      blank: [
        ...images.filter((el) => el.dataset.src && !el.getAttribute("src")),
        ...backgrounds.filter((el) => el.dataset.src && !el.style.backgroundImage),
      ].map((el) => el.dataset.src ?? ""),
    };
  });

  expect(unresolved.counted, "the home page has no lazy images to check").toBeGreaterThan(0);
  expect(unresolved.blank).toEqual([]);
});

test("App starts its modules and components when the document has already loaded", async ({
  page,
}) => {
  await openPage(page, "/test/components");

  // The legacy bundle loads through SystemJS and can finish after
  // DOMContentLoaded (#21), where a listener added then never runs. Build a
  // second App at that point, with probes in place of the real modules and
  // components. Before the readiness helper, neither probe ran.
  const started = await page.evaluate(() => {
    const App = window.App.constructor as new (config: unknown) => unknown;
    const calls: string[] = [];

    new App({
      modules: [{ init: () => calls.push("module"), destroy: () => {} }],
      components: [
        {
          selector: "body",
          Component: class {
            constructor() {
              calls.push("component");
            }
            destroy() {}
          },
        },
      ],
    });

    return { readyState: document.readyState, calls };
  });

  expect(started.readyState, "the document was still parsing").not.toBe("loading");
  expect(started.calls).toEqual(["module", "component"]);
});
