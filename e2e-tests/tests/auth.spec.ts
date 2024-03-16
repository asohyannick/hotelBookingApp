import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:3000/";
test("should sigin in", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  // Expect a title "to contain" a substring.
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("user5@gamil.com");
  await page.locator("[name=password]").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText(" Sign in Successful")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();
});

test("should allow user to register", async({page}) => {
  await page.goto(UI_URL)
  await page.getByRole("link", {name: "Sign In"}).click();
  await page.getByRole("link", {name: "Create an account here"}).click();
  await expect(
    page.getByRole("heading", {name: "Create an Account"})
  ).toBeVisible();
})