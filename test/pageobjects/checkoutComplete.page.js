import Page from './page';

class CheckoutCompletePage extends Page {
    get completeMsg() { return $('h2[data-test="complete-header"]'); }
    get btnBackHome() { return $('button[data-test="back-to-products"]'); }
}
export default new CheckoutCompletePage();
