import Page from './page';

class CheckoutCompletePage extends Page {
    get completeMsg() { return $('h2[data-test="complete-header"]'); }
    get btnBackHome() { return $('button[data-test="back-to-products"]'); }

    async getCompleteMsgText() {
        return await this.getText(await this.completeMsg);
    }
    async btnBackHomeClick() {
        await this.click(await this.btnBackHome);
    }
}
const checkoutCompletePage = new CheckoutCompletePage();
export default checkoutCompletePage;
