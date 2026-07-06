import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';

export class DashboardPage {
  private page: Page;
  
  // Locators
  private dashboardTitle: Locator;
  private userMenu: Locator;
  private logoutButton: Locator;
  private welcomeMessage: Locator;
  private mainContent: Locator;
  private navigationMenu: Locator;
  private modules: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.dashboardTitle = page.getByRole('heading', { level: 1 }) || page.locator('h1');
    this.userMenu = page.getByRole('button', { name: /user|profile|menu/i }) || page.locator('[data-testid="user-menu"]');
    this.logoutButton = page.getByRole('menuitem', { name: /logout|sign out/i }) || page.locator('button[data-testid="logout"]');
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]') || page.locator('.welcome');
    this.mainContent = page.locator('main') || page.locator('[role="main"]');
    this.navigationMenu = page.locator('nav') || page.locator('[role="navigation"]');
    this.modules = page.locator('[data-testid="module"]') || page.locator('.module-item');
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad(): Promise<void> {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await this.mainContent.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Dashboard loaded successfully');
  }

  /**
   * Check if dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    logger.info('Checking if dashboard is displayed');
    return await this.mainContent.isVisible();
  }

  /**
   * Get dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    logger.info('Getting dashboard title');
    return await this.dashboardTitle.textContent() || '';
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    logger.info('Getting welcome message');
    return await this.welcomeMessage.textContent() || '';
  }

  /**
   * Check if user menu is visible
   */
  async isUserMenuVisible(): Promise<boolean> {
    logger.info('Checking if user menu is visible');
    return await this.userMenu.isVisible();
  }

  /**
   * Click on user menu
   */
  async clickUserMenu(): Promise<void> {
    logger.info('Clicking user menu');
    await this.userMenu.click();
  }

  /**
   * Click logout button
   */
  async clickLogout(): Promise<void> {
    logger.info('Clicking logout button');
    await this.logoutButton.click();
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    logger.info('Starting logout flow');
    await this.clickUserMenu();
    await this.page.waitForTimeout(500);
    await this.clickLogout();
    logger.info('Logout completed');
  }

  /**
   * Get all available modules
   */
  async getAvailableModules(): Promise<string[]> {
    logger.info('Getting available modules');
    const moduleElements = await this.modules.all();
    const moduleNames: string[] = [];
    
    for (const module of moduleElements) {
      const name = await module.textContent();
      if (name) {
        moduleNames.push(name.trim());
      }
    }
    
    logger.info(`Found modules: ${moduleNames.join(', ')}`);
    return moduleNames;
  }

  /**
   * Check if specific module is available
   */
  async isModuleAvailable(moduleName: string): Promise<boolean> {
    logger.info(`Checking if module '${moduleName}' is available`);
    const modules = await this.getAvailableModules();
    return modules.some(m => m.toLowerCase().includes(moduleName.toLowerCase()));
  }

  /**
   * Click on a specific module
   */
  async clickModule(moduleName: string): Promise<void> {
    logger.info(`Clicking module: ${moduleName}`);
    await this.page.getByRole('button', { name: new RegExp(moduleName, 'i') }).click();
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationMenuVisible(): Promise<boolean> {
    logger.info('Checking if navigation menu is visible');
    return await this.navigationMenu.isVisible();
  }

  /**
   * Get page URL
   */
  async getPageUrl(): Promise<string> {
    logger.info('Getting page URL');
    return this.page.url();
  }

  /**
   * Refresh page
   */
  async refreshPage(): Promise<void> {
    logger.info('Refreshing page');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Take screenshot of dashboard
   */
  async takeScreenshot(filename: string): Promise<void> {
    logger.info(`Taking screenshot: ${filename}`);
    await this.page.screenshot({ path: `./reports/screenshots/${filename}.png`, fullPage: true });
  }
}

export default DashboardPage;
