import Page from './page';

class LoginPage extends Page {
    open() { return super.open(""); }

    get inputUserName() { return $('input[data-test="username"]'); }
    get inputPassword() { return $('input[data-test="password"]'); }
    get btnLogin() { return $('input[data-test="login-button"]'); }
    get errorMsg() { return $('h3[data-test="error"]'); }

    async fillLoginPasswordFields(userName, password) {
        await this.inputUserName.addValue(userName);
        await this.inputPassword.addValue(password);
    }
    async getErrorText() {
        return await this.getText(await this.errorMsg);
    }
}
const loginPage = new LoginPage();
export default loginPage;
