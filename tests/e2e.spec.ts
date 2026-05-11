import { test, expect } from '@playwright/test';

test('Landing load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Feria de Ciencias 2026')).toBeVisible();
});

test('Student can access map', async ({ page }) => {
   await page.goto('/#/login');
   await page.fill('input[id="name"]', 'Pepe');
   await page.fill('input[id="lastName"]', 'V');
   await page.fill('input[id="group"]', '1A');
   await page.click('button[type="submit"]');

   await expect(page.locator('text=Hola, Pepe!')).toBeVisible();
});
