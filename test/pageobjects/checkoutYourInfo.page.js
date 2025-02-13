import Page from './page';
import { checkoutYourInfoPageData } from './testData';

class CheckoutYourInfoPage extends Page {
    get formCheckout() { return $('[class="checkout_info"]'); }
    get inputFirstName() { return $('input[data-test="firstName"]'); }
    get inputLastName() { return $('input[data-test="lastName"]'); }
    get inputPostalCode() { return $('input[data-test="postalCode"]'); }
    get btnContinue() { return $('[data-test="continue"]'); }

    async fillCheckoutForm() {
        await this.inputFirstName.addValue(checkoutYourInfoPageData.firstName);
        await this.inputLastName.addValue(checkoutYourInfoPageData.lastName);
        await this.inputPostalCode.addValue(checkoutYourInfoPageData.postalCode);
    }
}
export default new CheckoutYourInfoPage();
