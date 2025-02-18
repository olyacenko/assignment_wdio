import loginPage from "../pageobjects/login.page";
import inventoryPage from "../pageobjects/inventory.page";
import { loginPageData, inventoryPageData } from "../pageobjects/testData";

describe("Test suit Objective: Footer", () => {
    it("ID_7. Footer Links ", async () => {
        await loginPage.open();
        await expect(browser).toHaveUrl(loginPageData.pageUrl);
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
        await expect(browser).toHaveUrl(inventoryPageData.pageUrl);

        await inventoryPage.verifySocialLinksOpenInNewTab();
    });

});
