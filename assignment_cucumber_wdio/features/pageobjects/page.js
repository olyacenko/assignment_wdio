export default class Page {
    open(path) {
        return browser.url(`https://www.saucedemo.com/${path}`)
    }
    async clickButtonByText(buttonText) {
        const button = await $(`//button[text()=${buttonText}] | //input[@value=${buttonText}]`); 
        await button.click();
    }
    async getText(selector) {
        return await selector.getText();
    }
}
