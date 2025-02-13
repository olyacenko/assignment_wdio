import Page from './page';

class CheckoutOverviewPage extends Page {
    get products() { return $$('div[data-test="inventory-item"]'); }
    get totalPrice() { return $('[data-test="subtotal-label"]'); }
    get productNames() { return $$('div[data-test="inventory-item-name"]'); }
    get productPrices() { return $$('div[data-test="inventory-item-price"]'); }
    get btnFinish() { return $('button[data-test="finish"]'); }

    async productsToBeDisplayed() {
        return await this.itemsToBeDisplayed(await this.products);
    }
    async getProductPrices() {
        return await this.getPrices(await this.productPrices);
    }
    async getProductNames() {
        return await this.getNames(await this.productNames);
    }
    async getSumOfProductPrices(array) {
        const sum = array.reduce((total, value) => total + value);
        return sum;
    }
    async getTotalPrice() {
        const text = await this.totalPrice.getText();
        return parseFloat(text.replace("Item total: $", ""));
    }

}
export default new CheckoutOverviewPage();
