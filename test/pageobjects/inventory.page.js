import Page from "./page";
import { inventoryPageData } from "./testData";

class InventoryPage extends Page {
    //Menu
    get btnBurgerMenu() { return $('div[class="bm-burger-button"]'); }
    get expandedMenu() { return $('div[class="bm-menu-wrap"]'); }
    get menuItems() { return $$('a[class="bm-item menu-item"]'); }
    get btnLogout() { return $('a[data-test="logout-sidebar-link"]'); }
    get btnResetAppState() { return $('a[data-test="reset-sidebar-link"]'); }

    async logout() {
        await this.btnLogout.waitForClickable({ timeout: 2000 });
        await this.btnLogout.click();
    }
    async resetAppState() {
        await this.btnBurgerMenu.click();
        await this.btnResetAppState.waitForClickable({ timeout: 2000 });
        await this.btnResetAppState.click();
    }
    async menuToBeExpanded() {
        await browser.waitUntil(async () => {
            return await this.expandedMenu.getAttribute("aria-hidden") === "false";
        }, { timeout: 2000, timeoutMsg: "Menu did not expand" });
    }
    async checkAllMenuItemsPresent() {
        const menuItems = await this.menuItems;
        await browser.waitUntil(async () => {
            return menuItems.length === 4;
        }, { timeout: 2000, timeoutMsg: `Menu expected to contain 4 items but received: ${menuItems.length}!` });
    }
    async menuItemsToBeDisplayed() {
        return await this.itemsToBeDisplayed(await this.menuItems);
    }

    //Cart
    get btnCart() { return $("#shopping_cart_container"); }
    get cartBadge() { return $('[data-test="shopping-cart-badge"]'); }

    async cartBadgeCounter() {
        if (await this.cartBadge.isDisplayed()) {
            return parseInt(await this.cartBadge.getText());
        }
        return 0;
    }

    //Products
    get products() { return $$('div[data-test="inventory-item"]'); }
    get productNames() { return $$('div[data-test="inventory-item-name"]'); }
    get productPrices() { return $$('div[data-test="inventory-item-price"]'); }
    get addToCartBtns() { return $$('button[id^="add-to-cart"]'); }


    async productsToBeDisplayed() {
        return await this.itemsToBeDisplayed(await this.products);
    }
    async addRandomProductToCart() {
        const randomIndex = Math.floor(Math.random() * await this.addToCartBtns.length);
        let id = await this.addToCartBtns[randomIndex].getAttribute("id");
        id = id.replace("add-to-cart-", "");
        await this.addToCartBtns[randomIndex].click();
        return id;
    }
    async getProductPrices() {
        return await this.getPrices(await this.productPrices);
    }
    async getProductNames() {
        return await this.getNames(await this.productNames);
    }

    // Sort products
    get sortingDropdown() { return $('[data-test="product-sort-container"]'); }

    async sortProducts(selectedOption) {
        await this.sortingDropdown.selectByVisibleText(selectedOption);

        if (selectedOption === inventoryPageData.priceLowToHigh) {
            const priceValues = await this.getProductPrices();
            return priceValues.every((value, index, array) => index === 0 || array[index - 1] <= value);
        }

        if (selectedOption === inventoryPageData.priceHighToLow) {
            const priceValues = await this.getProductPrices();
            return priceValues.every((value, index, array) => index === 0 || array[index - 1] >= value);
        }

        if (selectedOption === inventoryPageData.nameAtoZ) {
            const nameValues = await this.getProductNames();
            return nameValues.every((value, index, array) => index === 0 || array[index - 1].localeCompare(value) <= 0);
        }

        if (selectedOption === inventoryPageData.nameZtoA) {
            const nameValues = await this.getProductNames();
            return nameValues.every((value, index, array) => index === 0 || array[index - 1].localeCompare(value) >= 0);
        }
        throw new Error(`Invalid sorting option: ${selectedOption}`);
    }

    //Footer Links
    get iconTwitter() { return $('a[data-test="social-twitter"]'); }
    get iconFacebook() { return $('a[data-test="social-facebook"]'); }
    get iconLinkedIn() { return $('a[data-test="social-linkedin"]'); }

    get socialLinks() {
        return [
            { icon: this.iconTwitter, expectedUrl: inventoryPageData.twitter },
            { icon: this.iconFacebook, expectedUrl: inventoryPageData.facebook },
            { icon: this.iconLinkedIn, expectedUrl: inventoryPageData.linkedIn }
        ];
    }
    async verifySocialLinksOpenInNewTab() {
        for (const { icon, expectedUrl } of this.socialLinks) {
            const initialHandles = await browser.getWindowHandles();
            await icon.click();

            await browser.waitUntil(async () => {
                const newHandles = await browser.getWindowHandles();
                return newHandles.length > initialHandles.length;
            }, { timeout: 5000, timeoutMsg: "New tab didn't open" });

            const newHandles = await browser.getWindowHandles();
            const newTabHandle = newHandles.find(handle => !initialHandles.includes(handle));

            await browser.switchToWindow(newTabHandle);
            const currentUrl = await browser.getUrl();

            expect(currentUrl).toContain(expectedUrl);

            await browser.closeWindow();
            await browser.switchToWindow(initialHandles[0]);
        }
    }
}
export default new InventoryPage();
