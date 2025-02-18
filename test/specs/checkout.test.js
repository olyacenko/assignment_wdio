import loginPage from "../pageobjects/login.page";
import inventoryPage from "../pageobjects/inventory.page";
import cartPage from "../pageobjects/cart.page";
import checkoutYourInfoPage from "../pageobjects/checkoutYourInfo.page";
import checkoutOverviewPage from "../pageobjects/checkoutOverview.page";
import checkoutCompletePage from "../pageobjects/checkoutComplete.page";
import {loginPageData, inventoryPageData, cartPageData, checkoutYourInfoPageData, checkoutOverviewData, checkoutCompletePageData} from "../pageobjects/testData";

describe("Test suit Objective: Checkout", () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    it("ID_8. Valid Checkout ", async () => {
        // 1_Step. ER: Number near the cart at the top right increase by 1, product is added to cart
        let initialValueCartBadge = await inventoryPage.cartBadgeCounter();

        let addedProductsToCart = [];
        addedProductsToCart.push(await inventoryPage.addRandomProductToCart());

        let newValueCartBadge = await inventoryPage.cartBadgeCounter();
        await expect(newValueCartBadge).toBe(initialValueCartBadge + addedProductsToCart.length);

        //2_Step. ER: Cart page is displayed, product is the same as was added at step 1
        await inventoryPage.btnCartClick();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);

        let productsInCart = await cartPage.getProductsID();
        await expect(addedProductsToCart).toStrictEqual(productsInCart);

        const nameProductsInCart = await cartPage.getProductNames();
        const priceProductsInCart = await cartPage.getProductPrices();

        //3_Step. ER: Checkout form is displayed
        await cartPage.btnCheckoutClick();
        await expect(checkoutYourInfoPage.formCheckout).toBeDisplayed();

        //4,5,6_Steps. ER: Data is entered to the field
        await checkoutYourInfoPage.fillCheckoutForm();
        await expect(checkoutYourInfoPage.inputFirstName).toHaveValue(checkoutYourInfoPageData.firstName);
        await expect(checkoutYourInfoPage.inputLastName).toHaveValue(checkoutYourInfoPageData.lastName);
        await expect(checkoutYourInfoPage.inputPostalCode).toHaveValue(checkoutYourInfoPageData.postalCode);

        //7_Step. ER: User is redirected to the "Overview" page, Products from step 1 is displayed. Total price = price of products from step 1
        await checkoutYourInfoPage.btnContinueClick();
        await expect(browser).toHaveUrl(checkoutOverviewData.pageUrl);
        await checkoutOverviewPage.productsToBeDisplayed();

        const nameProductsInCheckoutOverview = await checkoutOverviewPage.getProductNames();
        const priceProductsInCheckoutOverview = await checkoutOverviewPage.getProductPrices();
        await expect(nameProductsInCart).toStrictEqual(nameProductsInCheckoutOverview);
        await expect(priceProductsInCart).toStrictEqual(priceProductsInCheckoutOverview);

        const sumOfProductPrices = await checkoutOverviewPage.getSumOfProductPrices(priceProductsInCart);
        const totalPrice = await checkoutOverviewPage.getTotalPrice();
        await expect(sumOfProductPrices).toBe(totalPrice);

        //8_Step. ER: User is redirected to the "Checkout Complete" page, "Thank you for your order!" message is displayed
        await checkoutOverviewPage.btnFinishClick();
        await expect(browser).toHaveUrl(checkoutCompletePageData.pageUrl);

        await expect(checkoutCompletePage.completeMsg).toBeDisplayed();
        // const completeMsgText = await checkoutCompletePage.completeMsg.getText();
        await expect(await checkoutCompletePage.getCompleteMsgText()).toBe(checkoutCompletePageData.completeMsgContent);

        //9_Step. ER: User is redirected to the inventory page. Products are displayed. Cart is empty
        await checkoutCompletePage.btnBackHomeClick();
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await inventoryPage.productsToBeDisplayed();
        await expect(await inventoryPage.cartBadgeCounter()).toBe(initialValueCartBadge);

        productsInCart = await cartPage.getProductsID();
        await inventoryPage.btnCartClick();
        await expect(productsInCart.length).toBe(0);
    });

    it("ID_9. Checkout without products ", async () => {
        await inventoryPage.btnCartClick();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        const productsInCart = await cartPage.products;
        await expect(productsInCart.length).toBe(0);

        await cartPage.btnCheckoutClick();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        
        await expect(cartPage.errorMsg).toBeDisplayed();
        await expect(await cartPage.getErrorText()).toBe(cartPage.errorMsgContent);
    });
});
