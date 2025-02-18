import loginPage from "../pageobjects/login.page";
import inventoryPage from "../pageobjects/inventory.page";
import { loginPageData, inventoryPageData } from "../pageobjects/testData";

describe("Test suit Objective: Login", () => {
    beforeEach(async () => {
        await loginPage.open();
    });
    it("ID_1. Valid Login", async () => {
        await loginPage.fillLoginPasswordFields(loginPageData.validUserName, loginPageData.validPassword);
        await expect(loginPage.inputUserName).toHaveValue(loginPageData.validUserName);
        await expect(loginPage.inputPassword).toHaveValue(loginPageData.validPassword);
        await expect(loginPage.inputPassword).toHaveAttribute("type", "password");

        await loginPage.btnLoginClick();
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);
        await inventoryPage.productsToBeDisplayed();
        await expect(inventoryPage.btnCart).toBeDisplayed();
    });
    it("ID_2. Login with invalid password", async () => {
        await loginPage.fillLoginPasswordFields(loginPageData.validUserName, loginPageData.invalidPassword);
        await expect(loginPage.inputUserName).toHaveValue(loginPageData.validUserName);
        await expect(loginPage.inputPassword).toHaveValue(loginPageData.invalidPassword);
        await expect(loginPage.inputPassword).toHaveAttribute("type", "password");

        await loginPage.btnLoginClick();
        await loginPage.loginPasswordFieldsToBeRed();
        await expect(loginPage.errorMsg).toBeDisplayed();
        await expect(await loginPage.getErrorText()).toBe(loginPageData.errorMsgContent);
    });
    it("ID_3. Login with invalid login", async () => {
        await loginPage.fillLoginPasswordFields(loginPageData.invalidUserName, loginPageData.validPassword);
        await expect(loginPage.inputUserName).toHaveValue(loginPageData.invalidUserName);
        await expect(loginPage.inputPassword).toHaveValue(loginPageData.validPassword);
        await expect(loginPage.inputPassword).toHaveAttribute("type", "password");

        await loginPage.btnLoginClick();
        await loginPage.loginPasswordFieldsToBeRed();
        await expect(loginPage.errorMsg).toBeDisplayed();
        await expect(await loginPage.getErrorText()).toBe(loginPageData.errorMsgContent);
    });
    it("ID_4. Logout", async () => {
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await inventoryPage.btnBurgerMenuClick();
        await inventoryPage.menuToBeExpanded();
        await inventoryPage.checkAllMenuItemsPresent();
        await inventoryPage.menuItemsToBeDisplayed();

        await inventoryPage.logout();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await loginPage.loginPasswordFieldsToBeEmpty();
    });
});
