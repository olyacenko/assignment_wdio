import Page from './page';

class LoginPage extends Page {
    open() { return super.open(""); }

    get inputUserName() { return $('input[data-test="username"]'); }
    get inputPassword() { return $('input[data-test="password"]'); }
    get btnLogin() { return $('input[data-test="login-button"]'); }
    get errorIcons() { return $$('svg[data-icon="times-circle"]'); }
    get errorMsg() { return $('h3[data-test="error"]'); }

    async fillLoginPasswordFields(userName, password) {
        await this.inputUserName.addValue(userName);
        await this.inputPassword.addValue(password);
    }
    async login(userName, password) {
        await this.inputUserName.addValue(userName);
        await this.inputPassword.addValue(password);
        await this.btnLogin.click();
    }
    async loginPasswordFieldsToBeEmpty() {
        await expect(this.inputUserName).toHaveValue("");
        await expect(this.inputPassword).toHaveValue("");
    }
    async errorIconsToBeDisplayed() {
        for (const errorIcon of this.errorIcons) {
            await expect(errorIcon).toBeDisplayed();
        }
    }
    async loginPasswordFieldsToBeRed() {
        await browser.waitUntil(async () => {
            const borderColorLogin = await this.inputUserName.getCSSProperty("border-bottom-color");
            const borderColorPassword = await this.inputPassword.getCSSProperty("border-bottom-color");

            console.log("Login border color = ", borderColorLogin.value);
            console.log("Password border color = ", borderColorPassword.value);

            return borderColorLogin.value === "rgba(226,35,26,1)" &&
                borderColorPassword.value === "rgba(226,35,26,1)";
        }, { timeout: 2000, timeoutMsg: "The login or password border did not turn red!" });
    }
}
export default new LoginPage();
