import { test, expect, type BrowserContext } from "@playwright/test";

async function signIn(context: BrowserContext, id = "admin") {
  const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.fixture-signature`;
  const session = { access_token: token, refresh_token: "fixture-refresh", expires_at: Math.floor(Date.now() / 1000) + 3600, expires_in: 3600, token_type: "bearer", user: { id, app_metadata: {}, user_metadata: {} } };
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, domain: "localhost", path: "/" }]);
}

test("public registration form fits narrow screens, including native birthday controls", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/registreer");
    const date = page.locator('input[name="date_of_birth"]');
    await date.fill("1985-06-15");
    const bounds = await date.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const overflows = await page.locator("fieldset, input.ui-input, select.ui-input, textarea.ui-input").evaluateAll((elements) => elements.filter((e) => {
      const bounds = e.getBoundingClientRect();
      return bounds.x < 0 || bounds.right > window.innerWidth + 1;
    }).map((e) => e.outerHTML.slice(0, 100)));
    expect(overflows).toEqual([]);
  }
});

test("all formats download complete authenticated data past the 1,000-row limit", async ({ context, page }) => {
  await signIn(context);
  for (const [format, mime, signature] of [
    ["pdf", "application/pdf", "%PDF-"],
    ["xlsx", "spreadsheetml.sheet", "PK"],
    ["docx", "wordprocessingml.document", "PK"],
    ["csv", "text/csv", ""],
    ["print", "text/html", "<!doctype html>"],
  ]) {
    const response = await page.request.get(`/api/verslae?formaat=${format}&omvang=almal`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(mime);
    expect(response.headers()["cache-control"]).toContain("no-store");
    const bytes = await response.body();
    expect(bytes.length).toBeGreaterThan(1000);
    expect(bytes.toString("utf8").startsWith(signature)).toBe(true);
    if (format === "csv") {
      expect(bytes.toString("utf8")).toContain("Toetslid 1004");
      expect(bytes.toString("utf8").trim().split("\r\n")).toHaveLength(1006);
    }
    expect(bytes.toString("utf8")).not.toContain("PRIVATE_NOTES_MUST_NOT_BE_EXPORTED");
  }
});

test("ministry exports honor date filters in every format", async ({ context, page }) => {
  await signIn(context);
  for (const format of ["pdf", "xlsx", "docx", "csv", "print"]) {
    const response = await page.request.get(`/api/verslae?verslag=bediening&formaat=${format}&tydperk=vandag`);
    expect(response.status()).toBe(200);
    if (["csv", "print"].includes(format)) {
      const text = await response.text();
      expect(text).toContain("Toetsbesoek 0");
      expect(text).not.toContain("Toetsbesoek 1");
      expect(text).not.toContain("Toetsbesoek 2");
      expect(text).not.toContain("PRIVATE_PASTORAL_NOTES");
    }
  }
});

test("unauthenticated and lower-role users cannot export ministry data", async ({ context, page }) => {
  const anonymous = await page.request.get("/api/verslae?formaat=pdf", { maxRedirects: 0 });
  expect([401, 307]).toContain(anonymous.status());
  await signIn(context, "reader");
  const forbidden = await page.request.get("/api/verslae?verslag=bediening&formaat=pdf");
  expect(forbidden.status()).toBe(403);
  const allowed = await page.request.get("/api/verslae?verslag=lidmate&formaat=csv");
  expect(allowed.status()).toBe(200);
  const invalid = await page.request.get("/api/verslae?formaat=exe");
  expect(invalid.status()).toBe(400);
});

test("database failures return errors instead of empty successful reports", async ({ context, page }) => {
  await signIn(context);
  await page.request.get("http://127.0.0.1:54421/__fail?table=lede");
  try {
    const response = await page.request.get("/api/verslae?formaat=xlsx");
    expect(response.status()).toBe(500);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.text()).toContain("Geen lêer is uitgevoer nie");
  } finally { await page.request.get("http://127.0.0.1:54421/__fail"); }
});

test("report buttons download files and the print button opens a dedicated report", async ({ context, page }) => {
  await signIn(context);
  await page.goto("/verslae");
  const button = page.getByRole("button", { name: "Volledige lidmateverslag", exact: true });
  const downloadEvent = page.waitForEvent("download");
  await button.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/lidmateverslag-.*\.pdf$/);
  expect(await download.failure()).toBeNull();
  await page.getByRole("button", { name: "Uitvoer", exact: true }).click();
  await page.getByLabel("Formaat").selectOption("xlsx");
  const xlsxEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Laai af", exact: true }).click();
  expect((await xlsxEvent).suggestedFilename()).toMatch(/\.xlsx$/);
  await page.goto("/wyke");
  const popupEvent = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Druk wyklys", exact: true }).click();
  const popup = await popupEvent;
  await expect(popup.getByRole("heading", { name: "Wyklys", exact: true })).toBeVisible();
  await expect(popup.getByRole("button", { name: "Druk verslag" })).toBeVisible();
  expect(popup.url()).toMatch(/^blob:/);
});

test("mobile admin actions, tabs, and member birthday fields fit the viewport", async ({ context, page }) => {
  await signIn(context);
  await page.setViewportSize({ width: 320, height: 844 });
  for (const path of ["/verslae", "/bediening", "/wyke", "/lidmate"]) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(await page.locator(".admin-main").evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    if (path === "/lidmate") {
      await page.getByRole("button", { name: "Nuwe lidmaat", exact: true }).click();
      const date = page.locator('[role="dialog"] input[name="date_of_birth"]');
      await date.fill("1990-08-22");
      const bounds = await date.boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    }
  }
});
