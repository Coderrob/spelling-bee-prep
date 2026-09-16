import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Spelling Bee Practice', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const speechSynthesis = {
        speak: (utterance: SpeechSynthesisUtterance) => {
          queueMicrotask(() => {
            utterance.onend?.(new Event('end') as SpeechSynthesisEvent);
          });
        },
        cancel: () => undefined,
        pause: () => undefined,
        resume: () => undefined,
        getVoices: () => [],
        speaking: false,
        pending: false,
        paused: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      };
      Object.defineProperty(globalThis, 'speechSynthesis', { value: speechSynthesis });
    });
    await page.goto('/');
  });

  test('displays the app title', async ({ page }) => {
    await expect(page.getByText(/Spelling Bee Prep/)).toBeVisible();
  });

  test('shows grade, mode, and difficulty selectors', async ({ page }) => {
    const grade = page.getByRole('combobox', { name: 'Grade level' });
    await grade.click();
    await page.getByRole('option', { name: 'Grade 5' }).click();
    await expect(grade).toHaveText('Grade 5');
    await expect(page.getByRole('button', { name: 'random' })).toBeVisible();
    const adaptive = page.getByRole('button', { name: 'adaptive' });
    await adaptive.click();
    await expect(adaptive).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('combobox', { name: 'Filter by difficulty' })).toBeVisible();
  });

  test('starts a practice session', async ({ page }) => {
    await page.getByRole('button', { name: /start practice/i }).click();
    await expect(page.getByText('Hear your next word')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /type the word/i })).toBeVisible();
  });

  test('starts with a keyboard-accessible skip link', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to practice' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('has no automatically detectable WCAG A or AA violations', async ({ page }) => {
    const initialAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(initialAudit.violations).toEqual([]);

    await page.getByRole('button', { name: /start practice/i }).click();
    const practiceAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(practiceAudit.violations).toEqual([]);
  });

  test('allows an answer to be submitted', async ({ page }) => {
    await page.getByRole('button', { name: /start practice/i }).click();
    const input = page.getByRole('textbox', { name: /type the word/i });
    await input.fill('test');
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(page.getByText(/correct|incorrect/i).first()).toBeVisible();
    await expect(page.getByText('Session Insights')).toBeVisible();
  });

  test('shows a definition hint', async ({ page }) => {
    await page.getByRole('button', { name: /start practice/i }).click();
    await page.getByRole('button', { name: /hint/i }).click();
    await expect(page.getByText(/definition/i)).toBeVisible();
  });

  test('opens the settings dialog', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    const dialog = page.getByRole('dialog', { name: 'Settings' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: 'Language' })).toBeVisible();
  });
});
