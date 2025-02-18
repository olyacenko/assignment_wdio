export default class Page {
      open(path) {
            return browser.url(`https://www.saucedemo.com/${path}`)
      }
      async click(selector) {
            await selector.waitForClickable({ timeout: 2000 });
            await selector.click();
      }
      
      //common methods that are used on the login, checkoutCompletePage pages
      async getText(selector) {
           return await selector.getText();
      }

      //common methods that are used on the inventory, cart, checkoutOverview pages
      async getPrices(selector) {
            const elements = await selector.map(async (element) => {
                  const text = await element.getText();
                  return parseFloat(text.replace("$", ""));
            });
            return Promise.all(elements);
      }
      async getNames(selector) {
            const elements = await selector.map(async (element) => {
                  return await element.getText();
            });
            return Promise.all(elements);
      }

      //common method that is used on the inventory, checkoutOverview pages
      async itemsToBeDisplayed(selector) {
            await browser.waitUntil(async () => {
                  const items = await selector;
                  if (items.length === 0) return false;

                  for (const item of items) {
                        if (!(await item.isDisplayed())) return false;
                  }
                  return true;
            }, { timeout: 2000, timeoutMsg: `Not all items are displayed!` });
      }
}
