export default class Page {
    open(path) {
        return browser.url(`https://www.saucedemo.com/${path}`)
    }
    async click(selector) {
        await selector.click();
    }
    async getText(selector) {
        return await selector.getText();
    }
}
