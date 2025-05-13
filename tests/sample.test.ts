import { test, expect } from '@playwright/test';

test.skip('basic book store test', async ({ page }) => {
  await page.goto('/books');
  await expect(page).toHaveURL(/books/);
  await expect(page.locator('.rt-table')).toBeVisible();
});
