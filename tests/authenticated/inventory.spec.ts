import { test, expect } from '@playwright/test';

test.describe('Authenticated Flows', () => {
  test('should display the inventory table with English headers', async ({ page }) => {
    await page.goto('/inventario');
    await expect(page).toHaveURL(/inventario/i);

    await expect(page.getByRole('columnheader', { name: /Name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Brand/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Category/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Status/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Serial Number/i })).toBeVisible();
  });
});

