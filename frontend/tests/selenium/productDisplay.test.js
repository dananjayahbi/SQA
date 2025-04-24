import { expect } from 'chai';
import { 
  setupDriver, 
  navigateTo, 
  findElementByTestId,
  findElementsByTestId,
  clickElementByTestId,
  waitForElementByTestId,
  isElementDisplayedByTestId,
  getElementTextByTestId
} from '../utils/testUtils.js';

describe('Product Listing and Cart Tests', function() {
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

  // Test case 1: Verify the display of product images and details
  it('should display product images and details correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');

    // Wait for products to load
    await waitForElementByTestId(driver, 'product-image');
    
    // Check if product images are displayed
    const productImages = await findElementsByTestId(driver, 'product-image');
    expect(productImages.length).to.be.greaterThan(0, 'No product images found');
    
    // Check if product names are displayed
    const productNames = await findElementsByTestId(driver, 'product-name');
    expect(productNames.length).to.be.greaterThan(0, 'No product names found');
    
    // Check if product prices are displayed
    const productPrices = await findElementsByTestId(driver, 'product-price');
    expect(productPrices.length).to.be.greaterThan(0, 'No product prices found');
    
    // Check if product descriptions are displayed
    const productDescriptions = await findElementsByTestId(driver, 'product-description');
    expect(productDescriptions.length).to.be.greaterThan(0, 'No product descriptions found');
  });

  // Test case 2: Verify the filter functionality for product categories
  it('should filter products by category correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Wait for filter button and click it (on mobile this opens the filter drawer)
    await waitForElementByTestId(driver, 'filter-button');
    await clickElementByTestId(driver, 'filter-button');
    
    // Find and click the first category checkbox
    const categoryCheckbox = await findElementByTestId(driver, 'category-checkbox-electronics');
    await categoryCheckbox.click();
    
    // Wait for products to reload after filtering
    await driver.sleep(1000); // Give some time for the filter to apply
    
    // Check if at least one product is displayed after filtering
    const filteredProducts = await findElementsByTestId(driver, 'product-card');
    expect(filteredProducts.length).to.be.greaterThan(0, 'No products found after category filtering');
  });

  // Test case 3: Check that adding a product to the cart works correctly
  it('should add a product to the cart correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Wait for add to cart buttons to be visible
    await waitForElementByTestId(driver, 'add-to-cart-button');
    
    // Click the first add to cart button
    const addToCartButtons = await findElementsByTestId(driver, 'add-to-cart-button');
    await addToCartButtons[0].click();
    
    // Wait a bit for the cart to update
    await driver.sleep(1000);
    
    // Open the cart by clicking the cart icon
    const cartIcon = await driver.findElement(By.css('.MuiBadge-badge'));
    await cartIcon.click();
    
    // Check if the cart has items
    await waitForElementByTestId(driver, 'cart-item');
    const cartItems = await findElementsByTestId(driver, 'cart-item');
    
    expect(cartItems.length).to.be.greaterThan(0, 'No items found in cart after adding product');
  });

  // Test case 4: Verify that the total price in the cart is updated correctly
  it('should update the total price in the cart correctly', async function() {
    // Navigate to products page
    await navigateTo(driver, '/store/products');
    
    // Clear cart first (if needed)
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
    
    // Add two different products to the cart
    const addToCartButtons = await findElementsByTestId(driver, 'add-to-cart-button');
    await addToCartButtons[0].click();
    await driver.sleep(500);
    
    // Get the price of the first product
    const priceText1 = await getElementTextByTestId(driver, 'product-price');
    const price1 = parseFloat(priceText1.replace('$', ''));
    
    // Add a second product if available
    if (addToCartButtons.length > 1) {
      await addToCartButtons[1].click();
      await driver.sleep(500);
    } else {
      // Add the first product again
      await addToCartButtons[0].click();
      await driver.sleep(500);
    }
    
    // Open the cart
    const cartIcon = await driver.findElement(By.css('.MuiBadge-badge'));
    await cartIcon.click();
    
    // Wait for cart total to appear
    await waitForElementByTestId(driver, 'cart-total');
    
    // Get cart total
    const cartTotalText = await getElementTextByTestId(driver, 'cart-total');
    const cartTotal = parseFloat(cartTotalText.replace('$', ''));
    
    // Get individual item prices in cart
    const itemPrices = await findElementsByTestId(driver, 'cart-item-price');
    let sumOfPrices = 0;
    
    for (const priceElement of itemPrices) {
      const priceText = await priceElement.getText();
      const price = parseFloat(priceText.replace('$', ''));
      sumOfPrices += price;
    }
    
    // Assert that cart total equals sum of individual prices
    expect(cartTotal).to.equal(sumOfPrices, 'Cart total does not match sum of item prices');
  });
});