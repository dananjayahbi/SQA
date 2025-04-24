import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { 
  setupDriver, 
  navigateTo, 
  findElementByTestId,
  findElementsByTestId,
  clickElementByTestId,
  waitForElementByTestId,
  inputTextByTestId,
  getElementTextByTestId
} from '../utils/testUtils.js';

describe('Cart Quantity and Product Functionality Tests', function() {
  let driver;

  // Setup webdriver before tests
  before(async function() {
    driver = await setupDriver();
  });

  // Quit webdriver after tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  // Test case 5: Check that the cart displays the correct quantity of products
  it('should display the correct quantity of products in the cart', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Clear cart first
    await driver.executeScript(`
      localStorage.setItem('cart', JSON.stringify({
        items: [],
        totalItems: 0,
        totalPrice: 0
      }));
    `);
    
    // Refresh page to apply cart changes
    await driver.navigate().refresh();
    
    // Wait for add to cart buttons to be visible
    await waitForElementByTestId(driver, 'add-to-cart-button');
    
    // Click the first add to cart button multiple times (adding 3 of the same product)
    const addToCartButtons = await findElementsByTestId(driver, 'add-to-cart-button');
    for (let i = 0; i < 3; i++) {
      await addToCartButtons[0].click();
      await driver.sleep(300);
    }
    
    // Open the cart
    const cartIcon = await driver.findElement(By.css('.MuiBadge-badge'));
    await cartIcon.click();
    
    // Wait for cart items to appear
    await waitForElementByTestId(driver, 'cart-item-quantity');
    
    // Get the quantity input for the first item
    const quantityInputs = await findElementsByTestId(driver, 'cart-item-quantity');
    const quantity = await quantityInputs[0].getAttribute('value');
    
    // Check that the quantity is as expected (3)
    expect(parseInt(quantity)).to.equal(3, 'Cart item quantity is not correct');
    
    // Check the cart badge count
    const badgeText = await driver.findElement(By.css('.MuiBadge-badge')).getText();
    expect(parseInt(badgeText)).to.equal(3, 'Cart badge count is not correct');
  });

  // Test case 6: Test the sorting functionality for products
  it('should sort products correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Wait for sort selector to be visible
    await waitForElementByTestId(driver, 'sort-select');
    
    // Click the sort selector
    await clickElementByTestId(driver, 'sort-select');
    
    // Wait for sort options to appear and select "Price: Low to High"
    await waitForElementByTestId(driver, 'sort-price-low');
    await clickElementByTestId(driver, 'sort-price-low');
    
    // Wait for products to reload after sorting
    await driver.sleep(1000);
    
    // Get all product prices
    const productPrices = await findElementsByTestId(driver, 'product-price');
    const prices = [];
    
    for (const priceElement of productPrices) {
      const priceText = await priceElement.getText();
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    
    // Check if prices are sorted in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).to.be.at.most(prices[i + 1], 'Products are not correctly sorted by price (low to high)');
    }
    
    // Now test sorting by price high to low
    await clickElementByTestId(driver, 'sort-select');
    await waitForElementByTestId(driver, 'sort-price-high');
    await clickElementByTestId(driver, 'sort-price-high');
    
    // Wait for products to reload after sorting
    await driver.sleep(1000);
    
    // Get all product prices again
    const productPricesDesc = await findElementsByTestId(driver, 'product-price');
    const pricesDesc = [];
    
    for (const priceElement of productPricesDesc) {
      const priceText = await priceElement.getText();
      const price = parseFloat(priceText.replace('$', ''));
      pricesDesc.push(price);
    }
    
    // Check if prices are sorted in descending order
    for (let i = 0; i < pricesDesc.length - 1; i++) {
      expect(pricesDesc[i]).to.be.at.least(pricesDesc[i + 1], 'Products are not correctly sorted by price (high to low)');
    }
  });

  // Test case 7: Verify that the product details page opens correctly
  it('should open the product details page correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Wait for products to load
    await waitForElementByTestId(driver, 'product-name');
    
    // Get the first product name for comparison
    const productNameElement = await findElementByTestId(driver, 'product-name');
    const productName = await productNameElement.getText();
    
    // Click on the first product name to go to the details page
    await productNameElement.click();
    
    // Wait for product detail page to load
    await waitForElementByTestId(driver, 'product-detail-container');
    
    // Verify product name on detail page matches the clicked product
    const detailPageNameElement = await findElementByTestId(driver, 'product-detail-name');
    const detailPageName = await detailPageNameElement.getText();
    
    expect(detailPageName).to.include(productName, 'Product name on detail page does not match');
    
    // Verify that other product details are displayed
    const detailsDisplayed = await Promise.all([
      driver.findElement(By.css('[data-testid="product-detail-image"]')).isDisplayed(),
      driver.findElement(By.css('[data-testid="product-detail-price"]')).isDisplayed(),
      driver.findElement(By.css('[data-testid="product-detail-description"]')).isDisplayed()
    ]);
    
    detailsDisplayed.forEach((displayed, index) => {
      expect(displayed).to.be.true, `Product detail element at index ${index} is not displayed`;
    });
    
    // Test that add to cart functionality works from detail page
    const addToCartButton = await findElementByTestId(driver, 'add-to-cart-button');
    await addToCartButton.click();
    
    // Wait for notification or cart update
    await driver.sleep(1000);
  });

  // Test case 8: Test the responsiveness of the page
  it('should be responsive and adapt to different window sizes', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Test desktop view (maximize window)
    await driver.manage().window().maximize();
    await driver.sleep(1000);
    
    // Check that desktop elements are visible
    const desktopFiltersVisible = await driver.findElement(By.css('.MuiGrid-root .MuiAccordion-root')).isDisplayed();
    expect(desktopFiltersVisible).to.be.true, 'Desktop filters are not visible in desktop view';
    
    // Test mobile view (set smaller window size)
    await driver.manage().window().setRect({ width: 375, height: 667 }); // iPhone 8 dimensions
    await driver.sleep(1000);
    
    // In mobile view, filter button should be visible instead of the sidebar
    const filterButtonVisible = await findElementByTestId(driver, 'filter-button').isDisplayed();
    expect(filterButtonVisible).to.be.true, 'Filter button is not visible in mobile view';
    
    // Check that the mobile menu button is visible
    const menuButtonVisible = await driver.findElement(By.css('button[aria-label="menu"]')).isDisplayed();
    expect(menuButtonVisible).to.be.true, 'Mobile menu button is not visible in mobile view';
    
    // Reset window size
    await driver.manage().window().maximize();
  });
});