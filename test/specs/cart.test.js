import loginPage from "../pageobjects/login.page";
import inventoryPage from "../pageobjects/inventory.page";
import cartPage from "../pageobjects/cart.page";
import { loginPageData, inventoryPageData, cartPageData } from "../pageobjects/testData";

describe("Test suit Objective: Cart", () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    afterEach(async () => {
        await loginPage.open();
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await inventoryPage.resetAppState();
    });
    it("ID_5. Saving the card after logout ", async () => {
        let initialValueCartBadge;
        let newValueCartBadge;
        let addedProductsToCart = [];
        let productsInCart;

        // 1_Step. ER: Number near the cart at the top right increase by 1, product is added to cart
        initialValueCartBadge = await inventoryPage.cartBadgeCounter();
        addedProductsToCart.push(await inventoryPage.addRandomProductToCart());
        newValueCartBadge = await inventoryPage.cartBadgeCounter();
        await expect(newValueCartBadge).toBe(initialValueCartBadge + addedProductsToCart.length);
        await inventoryPage.btnCartClick();
        productsInCart = await cartPage.getProductsID();
        await expect(addedProductsToCart).toStrictEqual(productsInCart);
        await cartPage.btnContinueShoppingClick();

        // 2_Step. ER: Menu are expanded, 4 items are displayed
        await inventoryPage.btnBurgerMenuClick();
        await inventoryPage.menuToBeExpanded();
        await inventoryPage.checkAllMenuItemsPresent();
        await inventoryPage.menuItemsToBeDisplayed();

        // 3_Step. ER: User are redirecred to the "Login" page, "Username" and "Password" field are empty
        await inventoryPage.logout();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await loginPage.loginPasswordFieldsToBeEmpty();

        //4_Step. ER: User is redirected to the inventory page. Products and cart are displayed
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);
        await inventoryPage.productsToBeDisplayed();
        await expect(inventoryPage.btnCart).toBeDisplayed();

        //5_Step. ER: Cart page is displayed, product are the same as was added at step 1
        await inventoryPage.btnCartClick();
        await expect(browser).toHaveUrl(cartPageData.pageUrl);
        await expect(addedProductsToCart).toStrictEqual(productsInCart);
    });

});
