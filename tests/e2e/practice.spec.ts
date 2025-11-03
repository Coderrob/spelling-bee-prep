import { test, expect } from '@playwright/test';

test.describe('Spelling Bee Practice', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display app title', async ({ page }) => {
    await expect(page.getByText('🐝 Spelling Bee Prep')).toBeVisible();
  });

  test('should show mode selector on initial load', async ({ page }) => {
    await expect(page.getByText('Choose Practice Mode')).toBeVisible();
    await expect(page.getByText('Random')).toBeVisible();
    await expect(page.getByText('By Difficulty')).toBeVisible();
    await expect(page.getByText('Challenges')).toBeVisible();
  });

  test('should start practice in random mode', async ({ page }) => {
    // Select random mode
    await page.getByText('Random').click();
    
    // Start practice
    await page.getByRole('button', { name: /start practice/i }).click();
    
    // Should see the practice interface
    await expect(page.getByText('Listen to the word')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /type the word/i })).toBeVisible();
  });

  test('should allow user to submit answer', async ({ page }) => {
    // Start practice
    await page.getByText('Random').click();
    await page.getByRole('button', { name: /start practice/i }).click();
    
    // Type an answer
    const input = page.getByRole('textbox', { name: /type the word/i });
    await input.fill('test');
    
    // Submit should be enabled
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeEnabled();
    
    await submitButton.click();
    
    // Should show result (either correct or incorrect)
    await expect(
      page.getByText(/correct|incorrect/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should show hint when requested', async ({ page }) => {
    // Start practice
    await page.getByText('Random').click();
    await page.getByRole('button', { name: /start practice/i }).click();
    
    // Click hint button
    await page.getByRole('button', { name: /hint/i }).click();
    
    // Should show hint with definition
    await expect(page.getByText(/definition/i)).toBeVisible();
  });

  test('should open settings dialog', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/language/i)).toBeVisible();
  });
});
