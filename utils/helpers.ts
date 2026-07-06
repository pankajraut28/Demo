import { Page } from '@playwright/test';
import logger from './logger';

export class Helpers {
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    logger.info('Waiting for page to load...');
    await page.waitForLoadState('networkidle', { timeout });
    logger.info('Page loaded successfully');
  }

  static async fillForm(page: Page, selectors: Record<string, string>, values: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(values)) {
      const selector = selectors[key];
      if (!selector) {
        logger.warn(`Selector not found for key: ${key}`);
        continue;
      }
      logger.info(`Filling ${key} with value`);
      await page.fill(selector, value);
    }
  }

  static async clickElement(page: Page, selector: string): Promise<void> {
    logger.info(`Clicking element: ${selector}`);
    await page.click(selector);
  }

  static async getText(page: Page, selector: string): Promise<string> {
    const text = await page.textContent(selector);
    logger.info(`Retrieved text: ${text}`);
    return text || '';
  }

  static async takeScreenshot(page: Page, filename: string): Promise<void> {
    const path = `./reports/screenshots/${filename}.png`;
    logger.info(`Taking screenshot: ${path}`);
    await page.screenshot({ path });
  }
}

export default Helpers;
