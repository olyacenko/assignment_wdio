import Page from './page';

class CartPage extends Page {
    get products() { return $$('div[data-test="inventory-item"]'); }
    get productNames() { return $$('div[data-test="inventory-item-name"]'); }
    get productPrices() { return $$('div[data-test="inventory-item-price"]'); }
    get btnCheckout() { return $('button[data-test="checkout"]'); }
    get btnContinueShopping() { return $('button[data-test="continue-shopping"]'); }
    get removeBtns() { return $$('button[id^="remove-"]'); }

    get errorMsg() { return $('[data-test="error"]'); }
    async getErrorText() {
        return await this.getText(await this.errorMsg);
    }

    async btnContinueShoppingClick() {
        await this.click(await this.btnContinueShopping);
    }
    async btnCheckoutClick() {
        await this.click(await this.btnCheckout);
    }
    async getProductsID() {
        const productsID = await this.removeBtns.map(async (elementID) => {
            let id = await elementID.getAttribute("id");
            id = id.replace("remove-", "");
            return id
        });
        return Promise.all(productsID);
    }
    async getProductPrices() {
        return await this.getPrices(await this.productPrices);
    }
    async getProductNames() {
        return await this.getNames(await this.productNames);
    }
}
const cartPage = new CartPage();
export default cartPage;
