import loginPage from "../pageobjects/login.page";
import inventoryPage from "../pageobjects/inventory.page";
import { loginPageData, inventoryPageData } from "../pageobjects/testData";

describe("Test suit Objective: Products", () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login(loginPageData.validUserName, loginPageData.validPassword);
    });
    it("ID_6. Sorting ", async () => {
        await expect(await inventoryPage.sortProducts(inventoryPageData.priceLowToHigh)).toBe(true);

        await expect(await inventoryPage.sortProducts(inventoryPageData.priceHighToLow)).toBe(true);

        await expect(await inventoryPage.sortProducts(inventoryPageData.nameAtoZ)).toBe(true);

        await expect(await inventoryPage.sortProducts(inventoryPageData.nameZtoA)).toBe(true);
    });

});