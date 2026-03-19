import { expect, test } from '@playwright/test';

test.describe('TravelWithMe UI', () => {
  test('loads home page with core navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('a.logo')).toHaveText(/TravelWithMe/);
    await expect(page.locator('section.hero-section')).toBeVisible();
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible();
  });

  test('navigates to login page from navbar', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/auth/login"]');

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.locator('form.auth-form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('redirects unknown route to home page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('section.hero-section')).toBeVisible();
  });
});
