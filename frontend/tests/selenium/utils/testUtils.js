import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Base URL for testing
const BASE_URL = 'http://localhost:5174';

// Common function to set up a webdriver instance
export async function setupDriver() {
  // Set up Chrome options
  const options = new chrome.Options();
  
  // Uncomment this line to run tests in headless mode
  // options.addArguments('--headless');
  
  // Initialize the webdriver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  // Set implicit wait time
  await driver.manage().setTimeouts({ implicit: 5000 });
  
  return driver;
}

// Helper functions for tests
export async function navigateTo(driver, path) {
  await driver.get(`${BASE_URL}${path}`);
}

export async function findElement(driver, selector) {
  return driver.findElement(By.css(selector));
}

export async function findElements(driver, selector) {
  return driver.findElements(By.css(selector));
}

export async function findElementByTestId(driver, testId) {
  return driver.findElement(By.css(`[data-testid="${testId}"]`));
}

export async function findElementsByTestId(driver, testId) {
  return driver.findElements(By.css(`[data-testid="${testId}"]`));
}

export async function waitForElement(driver, selector, timeout = 10000) {
  return driver.wait(until.elementLocated(By.css(selector)), timeout);
}

export async function waitForElementByTestId(driver, testId, timeout = 10000) {
  return driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)), timeout);
}

export async function waitForElementVisible(driver, element, timeout = 10000) {
  return driver.wait(until.elementIsVisible(element), timeout);
}

export async function waitForTextToBe(driver, selector, text, timeout = 10000) {
  return driver.wait(until.elementTextIs(driver.findElement(By.css(selector)), text), timeout);
}

export async function clickElement(driver, selector) {
  const element = await driver.findElement(By.css(selector));
  await element.click();
}

export async function clickElementByTestId(driver, testId) {
  const element = await driver.findElement(By.css(`[data-testid="${testId}"]`));
  await element.click();
}

export async function inputText(driver, selector, text) {
  const element = await driver.findElement(By.css(selector));
  await element.clear();
  await element.sendKeys(text);
}

export async function inputTextByTestId(driver, testId, text) {
  const element = await driver.findElement(By.css(`[data-testid="${testId}"]`));
  await element.clear();
  await element.sendKeys(text);
}

export async function getElementText(driver, selector) {
  const element = await driver.findElement(By.css(selector));
  return element.getText();
}

export async function getElementTextByTestId(driver, testId) {
  const element = await driver.findElement(By.css(`[data-testid="${testId}"]`));
  return element.getText();
}

export async function getElementAttribute(driver, selector, attribute) {
  const element = await driver.findElement(By.css(selector));
  return element.getAttribute(attribute);
}

export async function isElementDisplayed(driver, selector) {
  try {
    const element = await driver.findElement(By.css(selector));
    return element.isDisplayed();
  } catch (error) {
    return false;
  }
}

export async function isElementDisplayedByTestId(driver, testId) {
  try {
    const element = await driver.findElement(By.css(`[data-testid="${testId}"]`));
    return element.isDisplayed();
  } catch (error) {
    return false;
  }
}

// Add more helper functions as needed