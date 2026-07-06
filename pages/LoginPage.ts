import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';

export class LoginPage {
  private page: Page;
  
  // Locators
  private usernameField: Locator;
  private passwordField: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;
  private pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators - Using getByRole/getByLabel as priority
    this.usernameField = page.getByPlaceholder('Username') || page.getByLabel('Username') || page.locator('input[name="username"]');
    this.passwordField = page.getByPlaceholder('Password') || page.getByLabel('Password') || page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /login|sign in/i }) || page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]') || page.locator('.error-message');
    this.pageTitle = page.locator('h1, [data-testid="login-title"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    logger.info('Navigating to login page...');
    await this.page.goto('/login', { waitUntil: 'networkidle' });
    logger.info('Login page loaded');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.usernameField.fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.passwordField.fill(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    logger.info('Clicking login button');
    await this.loginButton.click();
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    logger.info('Starting login flow');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    logger.info('Login completed');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    logger.info('Retrieving error message');
    const message = await this.errorMessage.textContent();
    return message?.trim() || '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    logger.info('Checking if error message is visible');
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    logger.info('Checking if login page is displayed');
    return await this.pageTitle.isVisible();
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    logger.info('Clearing username field');
    await this.usernameField.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    logger.info('Clearing password field');
    await this.passwordField.clear();
  }

  /**
   * Get username field value
   */
  async getUsernameValue(): Promise<string> {
    logger.info('Getting username field value');
    return await this.usernameField.inputValue();
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    logger.info('Getting password field value');
    return await this.passwordField.inputValue();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    logger.info('Waiting for login page to load');
    await this.page.waitForLoadState('networkidle');
  }
}

export default LoginPage;
