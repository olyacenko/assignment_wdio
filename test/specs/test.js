import LoginPage from "../pageobjects/login.page";
import InventoryPage from "../pageobjects/inventory.page";
import CartPage from "../pageobjects/cart.page";
import CheckoutYourInfoPage from "../pageobjects/checkoutYourInfo.page";
import CheckoutOverviewPage from "../pageobjects/checkoutOverview.page";
import CheckoutCompletePage from "../pageobjects/checkoutComplete.page";
import {loginPageData, inventoryPageData, cartPageData, checkoutYourInfoPageData, checkoutOverviewData, checkoutCompletePageData} from "../pageobjects/testData";

describe("Test suit Objective: Login", () => {
    beforeEach(async () => {
        await LoginPage.open();
    });
    it("ID_1. Valid Login", async () => {
        await LoginPage.fillLoginPasswordFields(loginPageData.validUserName, loginPageData.validPassword);
        await expect(LoginPage.inputUserName).toHaveValue(loginPageData.validUserName);
        await expect(LoginPage.inputPassword).toHaveValue(loginPageData.validPassword);
        await expect(LoginPage.inputPassword).toHaveAttribute("type", "password");

        await LoginPage.btnLogin.click();
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);
        await InventoryPage.productsToBeDisplayed();
        await expect(InventoryPage.btnCart).toBeDisplayed();
    });
    it("ID_2. Login with invalid password", async () => {
        await LoginPage.fillLoginPasswordFields(loginPageData.validUserName, loginPageData.invalidPassword);
        await expect(LoginPage.inputUserName).toHaveValue(loginPageData.validUserName);
        await expect(LoginPage.inputPassword).toHaveValue(loginPageData.invalidPassword);
        await expect(LoginPage.inputPassword).toHaveAttribute("type", "password");

        await LoginPage.btnLogin.click();
        await LoginPage.loginPasswordFieldsToBeRed();
        await expect(LoginPage.errorMsg).toBeDisplayed();
        const errorText = await LoginPage.errorMsg.getText();
        await expect(errorText).toBe(loginPageData.errorMsgContent);
    });
    it("ID_3. Login with invalid login", async () => {
        await LoginPage.fillLoginPasswordFields(loginPageData.invalidUserName, loginPageData.validPassword);
        await expect(LoginPage.inputUserName).toHaveValue(loginPageData.invalidUserName);
        await expect(LoginPage.inputPassword).toHaveValue(loginPageData.validPassword);
        await expect(LoginPage.inputPassword).toHaveAttribute("type", "password");

        await LoginPage.btnLogin.click();
        await LoginPage.loginPasswordFieldsToBeRed();
        await expect(LoginPage.errorMsg).toBeDisplayed();
        const errorText = await LoginPage.errorMsg.getText();
        await expect(errorText).toBe(loginPageData.errorMsgContent);
    });
    it("ID_4. Logout", async () => {
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await InventoryPage.btnBurgerMenu.click();
        await InventoryPage.menuToBeExpanded();
        await InventoryPage.checkAllMenuItemsPresent();
        await InventoryPage.menuItemsToBeDisplayed();

        await InventoryPage.logout();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await LoginPage.loginPasswordFieldsToBeEmpty();
    });
});

describe("Test suit Objective: Cart", () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    afterEach(async () => {
        await LoginPage.open();
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await InventoryPage.resetAppState();
    });
    it("ID_5. Saving the card after logout ", async () => {
        let initialValueCartBadge;
        let newValueCartBadge;
        let addedProductsToCart = [];
        let productsInCart;

        // 1_Step. ER: Number near the cart at the top right increase by 1, product is added to cart
        initialValueCartBadge = await InventoryPage.cartBadgeCounter();
        addedProductsToCart.push(await InventoryPage.addRandomProductToCart());
        newValueCartBadge = await InventoryPage.cartBadgeCounter();
        await expect(newValueCartBadge).toBe(initialValueCartBadge + addedProductsToCart.length);
        await InventoryPage.btnCart.click();
        productsInCart = await CartPage.getProductsID();
        await expect(addedProductsToCart).toStrictEqual(productsInCart);
        await CartPage.btnContinueShopping.click();

        // 2_Step. ER: Menu are expanded, 4 items are displayed
        await InventoryPage.btnBurgerMenu.click();
        await InventoryPage.menuToBeExpanded();
        await InventoryPage.checkAllMenuItemsPresent();
        await InventoryPage.menuItemsToBeDisplayed();

        // 3_Step. ER: User are redirecred to the "Login" page, "Username" and "Password" field are empty
        await InventoryPage.logout();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await LoginPage.loginPasswordFieldsToBeEmpty();

        //4_Step. ER: User is redirected to the inventory page. Products and cart are displayed
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);
        await InventoryPage.productsToBeDisplayed();
        await expect(InventoryPage.btnCart).toBeDisplayed();

        //5_Step. ER: Cart page is displayed, product are the same as was added at step 1
        await InventoryPage.btnCart.click();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        await expect(addedProductsToCart).toStrictEqual(productsInCart);
    });

});

describe("Test suit Objective: Products", () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    it("ID_6. Sorting ", async () => {
        await expect(await InventoryPage.sortProducts(inventoryPageData.priceLowToHigh)).toBe(true);

        await expect(await InventoryPage.sortProducts(inventoryPageData.priceHighToLow)).toBe(true);

        await expect(await InventoryPage.sortProducts(inventoryPageData.nameAtoZ)).toBe(true);

        await expect(await InventoryPage.sortProducts(inventoryPageData.nameZtoA)).toBe(true);
    });

});

describe("Test suit Objective: Footer", () => {
    it("ID_7. Footer Links ", async () => {
        await LoginPage.open();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await InventoryPage.verifySocialLinksOpenInNewTab();
    });

});

describe("Test suit Objective: Checkout", () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    it("ID_8. Valid Checkout ", async () => {
        // 1_Step. ER: Number near the cart at the top right increase by 1, product is added to cart
        let initialValueCartBadge = await InventoryPage.cartBadgeCounter();

        let addedProductsToCart = [];
        addedProductsToCart.push(await InventoryPage.addRandomProductToCart());

        let newValueCartBadge = await InventoryPage.cartBadgeCounter();
        await expect(newValueCartBadge).toBe(initialValueCartBadge + addedProductsToCart.length);

        //2_Step. ER: Cart page is displayed, product is the same as was added at step 1
        await InventoryPage.btnCart.click();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);

        let productsInCart = await CartPage.getProductsID();
        await expect(addedProductsToCart).toStrictEqual(productsInCart);

        const nameProductsInCart = await CartPage.getProductNames();
        const priceProductsInCart = await CartPage.getProductPrices();

        //3_Step. ER: Checkout form is displayed
        await CartPage.btnCheckout.click();
        await expect(CheckoutYourInfoPage.formCheckout).toBeDisplayed();

        //4,5,6_Steps. ER: Data is entered to the field
        await CheckoutYourInfoPage.fillCheckoutForm();
        await expect(CheckoutYourInfoPage.inputFirstName).toHaveValue(checkoutYourInfoPageData.firstName);
        await expect(CheckoutYourInfoPage.inputLastName).toHaveValue(checkoutYourInfoPageData.lastName);
        await expect(CheckoutYourInfoPage.inputPostalCode).toHaveValue(checkoutYourInfoPageData.postalCode);

        //7_Step. ER: User is redirected to the "Overview" page, Products from step 1 is displayed. Total price = price of products from step 1
        await CheckoutYourInfoPage.btnContinue.click();
        await expect(browser).toHaveUrl(checkoutOverviewData.pageUrl);
        await CheckoutOverviewPage.productsToBeDisplayed();

        const nameProductsInCheckoutOverview = await CheckoutOverviewPage.getProductNames();
        const priceProductsInCheckoutOverview = await CheckoutOverviewPage.getProductPrices();
        await expect(nameProductsInCart).toStrictEqual(nameProductsInCheckoutOverview);
        await expect(priceProductsInCart).toStrictEqual(priceProductsInCheckoutOverview);

        const sumOfProductPrices = await CheckoutOverviewPage.getSumOfProductPrices(priceProductsInCart);
        const totalPrice = await CheckoutOverviewPage.getTotalPrice();
        await expect(sumOfProductPrices).toBe(totalPrice);

        //8_Step. ER: User is redirected to the "Checkout Complete" page, "Thank you for your order!" message is displayed
        await CheckoutOverviewPage.btnFinish.click();
        await expect(browser).toHaveUrl(checkoutCompletePageData.pageUrl);

        await expect(CheckoutCompletePage.completeMsg).toBeDisplayed();
        const completeMsgText = await CheckoutCompletePage.completeMsg.getText();
        await expect(completeMsgText).toBe(checkoutCompletePageData.completeMsgContent);

        //9_Step. ER: User is redirected to the inventory page. Products are displayed. Cart is empty
        await CheckoutCompletePage.btnBackHome.click();
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await InventoryPage.productsToBeDisplayed();
        await expect(await InventoryPage.cartBadgeCounter()).toBe(initialValueCartBadge);

        productsInCart = await CartPage.getProductsID();
        await InventoryPage.btnCart.click();
        await expect(productsInCart.length).toBe(0);
    });

    it("ID_9. Checkout without products ", async () => {
        await InventoryPage.btnCart.click();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        const productsInCart = await CartPage.products;
        await expect(productsInCart.length).toBe(0);

        await CartPage.btnCheckout.click();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        
        await expect(CartPage.errorMsg).toBeDisplayed();
        const errorText = await CartPage.errorMsg.getText();
        await expect(errorText).toBe(CartPage.errorMsgContent);
    });
});
 